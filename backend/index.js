const express = require('express');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default;
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();

app.use(express.json());

// CORS middleware (updated for frontend port 8080)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Check environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not set in .env file');
  process.exit(1);
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.error('Error: GOOGLE_CLIENT_ID is not set in .env file');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not set in .env file');
  process.exit(1);
}

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
if (!FINNHUB_API_KEY) {
  console.error('Error: FINNHUB_API_KEY is not set in .env file');
  process.exit(1);
}

const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
if (!BINANCE_API_KEY) {
  console.error('Error: BINANCE_API_KEY is not set in .env file');
  process.exit(1);
}

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Google OAuth setup
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Finance Tracker API Backend');
});

// Yahoo Finance: Default market data (Protected)
app.get('/api/market-data', verifyToken, async (req, res) => {
  try {
    const symbols = ['BTC-USD', 'ETH-USD'];
    const data = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await yahooFinance.quoteSummary(symbol);
        return {
          name: quote.price.longName || symbol.split('-')[0],
          symbol: quote.price.symbol,
          price: quote.price.regularMarketPrice,
          change: quote.price.regularMarketChangePercent * 100,
          marketCap: quote.summaryDetail.marketCap
            ? formatMarketCap(quote.summaryDetail.marketCap)
            : 'N/A',
        };
      })
    );
    console.log('Fetched default market data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching default data:', error.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Finnhub Fuzzy Search (Protected)
app.get('/api/fuzzy-search', verifyToken, async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    console.log('Missing or invalid query parameter:', req.query);
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`
    );
    const results = response.data.result.map((item) => ({
      symbol: item.symbol,
      name: item.description,
      type: item.type === 'Cryptocurrency' ? 'crypto' : 'stock',
      exchange: item.displaySymbol.split('.')[1] || 'N/A',
    }));
    console.log(`Finnhub fuzzy search results for "${query}":`, results);
    res.json(results.slice(0, 10));
  } catch (error) {
    console.error('Error fetching Finnhub fuzzy search:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Binance Fuzzy Search (Protected)
app.get('/api/binance-fuzzy-search', verifyToken, async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    console.log('Missing or invalid query parameter:', req.query);
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Fetch all trading pairs from Binance
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo', {
      headers: { 'X-MBX-APIKEY': BINANCE_API_KEY },
    });
    const symbols = response.data.symbols;

    // Fuzzy search simulation by filtering symbols
    const queryLower = query.toLowerCase();
    const results = symbols
      .filter((item) => 
        item.symbol.toLowerCase().includes(queryLower) || 
        (item.baseAsset && item.baseAsset.toLowerCase().includes(queryLower)) ||
        (item.quoteAsset && item.quoteAsset.toLowerCase().includes(queryLower))
      )
      .map((item) => ({
        symbol: item.symbol,
        name: `${item.baseAsset}/${item.quoteAsset}`,
        type: item.symbol.includes('USDT') || item.symbol.includes('BTC') ? 'crypto' : 'crypto', // Simplistic type assumption
        exchange: 'Binance',
      }));

    console.log(`Binance fuzzy search results for "${query}":`, results);
    res.json(results.slice(0, 10));
  } catch (error) {
    console.error('Error fetching Binance fuzzy search:', error.message);
    res.status(500).json({ error: 'Failed to fetch Binance search results' });
  }
});

// Yahoo Finance: Search endpoint (Protected)
app.get('/api/search', verifyToken, async (req, res) => {
  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') {
    console.log('Missing or invalid symbol parameter:', req.query);
    return res.status(400).json({ error: 'Symbol query parameter is required' });
  }
  try {
    const quote = await yahooFinance.quoteSummary(symbol.toUpperCase());
    const data = {
      name: quote.price.longName || symbol.split('-')[0],
      symbol: quote.price.symbol,
      price: quote.price.regularMarketPrice,
      change: quote.price.regularMarketChangePercent * 100,
      marketCap: quote.summaryDetail.marketCap
        ? formatMarketCap(quote.summaryDetail.marketCap)
        : 'N/A',
    };
    console.log(`Fetched data for ${symbol}:`, data);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    res.status(404).json({ error: `Failed to fetch data for ${symbol}` });
  }
});

// AI categorization using Hugging Face
const categorizeTransaction = async (description) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: description },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const sentiment = response.data[0][0].label;
    console.log(`Hugging Face response for "${description}":`, response.data);
    return sentiment === 'POSITIVE' ? 'Food' : 'Miscellaneous';
  } catch (error) {
    console.error('Error with Hugging Face API:', error.message);
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('coffee')) return 'Food';
    if (lowerDesc.includes('rent')) return 'Housing';
    if (lowerDesc.includes('salary')) return 'Income';
    return 'Miscellaneous';
  }
};

// POST /transactions (Protected)
app.post('/transactions', verifyToken, async (req, res) => {
  try {
    console.log('Received POST request from user:', req.user.id, req.body);
    const { amount, date, description } = req.body;
    if (!amount || !description) {
      console.log('Missing required fields');
      return res.status(400).send({ error: 'Amount and description are required' });
    }
    const category = await categorizeTransaction(description);
    console.log('Generated category:', category);
    const transaction = new Transaction({ 
      amount, 
      date, 
      description, 
      category,
      userId: req.user.id
    });
    console.log('Transaction to save:', transaction);
    const savedTransaction = await transaction.save();
    console.log('Saved transaction:', savedTransaction);
    res.status(201).send(savedTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error.message, error.stack);
    res.status(500).send({ error: 'Failed to save transaction', details: error.message });
  }
});

// GET /transactions (Protected)
app.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    console.log(`Fetched transactions for user ${req.user.id}:`, transactions);
    res.send(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).send({ error: 'Failed to fetch transactions' });
  }
});

// Authentication Endpoints
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password || !(await user.comparePassword(password))) {
      console.log('Login failed: Invalid credentials for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for', email);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup failed: User already exists', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Signup successful for', email);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/google-login', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        avatar: picture,
      });
      await user.save();
      console.log('New Google user created:', email);
    } else {
      console.log('Google login for existing user:', email);
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

function formatMarketCap(cap) {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  return `$${cap.toLocaleString()}`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
