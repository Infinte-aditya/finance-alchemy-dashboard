const express = require('express');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default;
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { categorizeTransaction } = require('./utils/categorize'); // Import from categorize.js

const app = express();

app.use(express.json());

// CORS middleware (assumes frontend runs on port 8080)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Environment variable validation
const requiredEnvVars = {
  MONGO_URI: process.env.MONGO_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Error: ${key} is not set in .env file`);
    process.exit(1);
  }
}

const CRYPTO_SYMBOLS = process.env.CRYPTO_SYMBOLS ? process.env.CRYPTO_SYMBOLS.split(',') : [];

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Google OAuth setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Root route
app.get('/', (req, res) => res.send('Welcome to the Finance Tracker API Backend'));

// Default market data
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
          currency: quote.price.currency || 'USD',
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

// Finnhub Fuzzy Search
app.get('/api/fuzzy-search', verifyToken, async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    console.log('Missing or invalid query parameter:', req.query);
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${process.env.FINNHUB_API_KEY}`
    );
    const results = response.data.result
      .filter(item => ['Common Stock', 'Cryptocurrency'].includes(item.type))
      .map((item) => ({
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

// Binance Fuzzy Search
app.get('/api/binance-fuzzy-search', verifyToken, async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    console.log('Missing or invalid query parameter:', req.query);
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo', {
      headers: { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY },
    });
    const symbols = response.data.symbols;

    const queryLower = query.toLowerCase();
    const results = symbols
      .filter((item) =>
        item.status === 'TRADING' &&
        !['DOWN', 'UP', 'BULL', 'BEAR'].some(keyword => item.symbol.includes(keyword)) &&
        (item.symbol.toLowerCase().includes(queryLower) ||
         (item.baseAsset && item.baseAsset.toLowerCase().includes(queryLower)) ||
         (item.quoteAsset && item.quoteAsset.toLowerCase().includes(queryLower)))
      )
      .map((item) => ({
        symbol: item.symbol,
        name: `${item.baseAsset}/${item.quoteAsset}`,
        type: 'crypto',
        exchange: 'Binance',
      }));

    console.log(`Binance fuzzy search results for "${query}":`, results);
    res.json(results.slice(0, 10));
  } catch (error) {
    console.error('Error fetching Binance fuzzy search:', error.message);
    res.status(500).json({ error: 'Failed to fetch Binance search results' });
  }
});

//spending by category
app.get('/api/spending-by-category', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $project: { category: '$_id', totalAmount: 1, _id: 0 } },
    ]);
    console.log(`Spending by category for user ${req.user.id}:`, transactions);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching spending by category:', error.message);
    res.status(500).json({ error: 'Failed to fetch spending by category' });
  }
});

// Search endpoint with currency
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
      currency: quote.price.currency || (CRYPTO_SYMBOLS.includes(`BINANCE:${symbol}`) ? 'USD' : 'USD'),
    };
    console.log(`Fetched data for ${symbol}:`, data);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error.message);
    res.status(404).json({ error: `Failed to fetch data for ${symbol}` });
  }
});

// Transaction endpoints
app.post('/transactions', verifyToken, async (req, res) => {
  try {
    const { amount, date, description, category: clientCategory } = req.body;
    if (!amount || !description) {
      return res.status(400).json({ error: 'Amount and description are required' });
    }
    // Use client-provided category if available, otherwise classify
    const finalCategory = clientCategory || (await categorizeTransaction(description));
    const transaction = new Transaction({
      amount,
      date,
      description,
      category: finalCategory,
      userId: req.user.id,
    });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error.message);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

app.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Authentication endpoints
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, token });
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
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, avatar: picture });
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, token });
  } catch (error) {
    console.error('Google login error:', error.message);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

// Utility function
function formatMarketCap(cap) {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  return `$${cap.toLocaleString()}`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));