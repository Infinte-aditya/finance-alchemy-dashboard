const express = require('express');
const mongoose = require('mongoose');
const yahooFinance = require('yahoo-finance2').default;
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const natural = require('natural');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const classifier = new natural.BayesClassifier();
const app = express();

// Middleware
app.use(express.json());

// Train Natural classifier
fs.createReadStream(path.join(__dirname, 'data', 'transactions.csv'))
  .pipe(csv())
  .on('data', (row) => classifier.addDocument(row.text, row.label))
  .on('end', () => {
    classifier.train();
    console.log('Natural classifier trained');
    classifier.save(path.join(__dirname, 'models', 'classifier.json'), (err) => {
      err ? console.error('Save error:', err) : console.log('Classifier saved');
    });
  });

// CORS Configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  req.method === 'OPTIONS' ? res.status(200).end() : next();
});

// Environment Validation
const requiredEnv = [
  'MONGO_URI', 'GOOGLE_CLIENT_ID', 'JWT_SECRET',
  'FINNHUB_API_KEY', 'BINANCE_API_KEY'
];
requiredEnv.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing ${varName} in .env`);
    process.exit(1);
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Google OAuth
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Market Data Endpoints
app.get('/api/market-data', verifyToken, async (req, res) => {
  try {
    const symbols = ['BTC-USD', 'ETH-USD'];
    const data = await Promise.all(symbols.map(async symbol => {
      const quote = await yahooFinance.quoteSummary(symbol);
      return {
        name: quote.price.longName || symbol,
        symbol: quote.price.symbol,
        price: quote.price.regularMarketPrice,
        change: quote.price.regularMarketChangePercent * 100,
        marketCap: formatMarketCap(quote.summaryDetail.marketCap)
      };
    }));
    res.json(data);
  } catch (error) {
    console.error('Market Data Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Search Endpoints
app.get('/api/search', verifyToken, async (req, res) => {
  try {
    const { symbol } = req.query;
    const quote = await yahooFinance.quoteSummary(symbol.toUpperCase());
    res.json({
      name: quote.price.longName || symbol,
      symbol: quote.price.symbol,
      price: quote.price.regularMarketPrice,
      change: quote.price.regularMarketChangePercent * 100,
      marketCap: formatMarketCap(quote.summaryDetail.marketCap)
    });
  } catch (error) {
    console.error('Search Error:', error.message);
    res.status(404).json({ error: 'Symbol not found' });
  }
});

// Fuzzy Search Endpoints
app.get('/api/fuzzy-search', verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${query}&token=${process.env.FINNHUB_API_KEY}`
    );
    res.json(response.data.result.slice(0, 10));
  } catch (error) {
    console.error('Finnhub Error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/binance-fuzzy-search', verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo', {
      headers: { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY }
    });
    
    const results = response.data.symbols
      .filter(symbol => 
        symbol.symbol.includes(query) ||
        symbol.baseAsset.includes(query) ||
        symbol.quoteAsset.includes(query)
      )
      .slice(0, 10);
    
    res.json(results);
  } catch (error) {
    console.error('Binance Error:', error.message);
    res.status(500).json({ error: 'Binance search failed' });
  }
});

// Transaction Handling
const categorizeTransaction = async (description) => {
  try {
    // Hugging Face API call
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: description },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    // Natural classifier fallback
    const naturalCategory = classifier.classify(description);
    
    return hfResponse.data[0][0].label === 'POSITIVE' 
      ? naturalCategory || 'Miscellaneous' 
      : 'Miscellaneous';
  } catch (error) {
    console.error('Categorization Error:', error.message);
    return classifier.classify(description) || 'Miscellaneous';
  }
};

app.post('/transactions', verifyToken, async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    const category = await categorizeTransaction(description);
    const transaction = await Transaction.create({
      amount,
      date: date || Date.now(),
      description,
      category,
      userId: req.user.id
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction Error:', error.message);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

app.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error('Transaction Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Auth Endpoints
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json(authResponse(user));
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'User exists' });
    }
    
    const user = await User.create({ name, email, password });
    res.status(201).json(authResponse(user));
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Signup failed' });
  }
});

app.post('/api/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ email }) || await User.create({ 
      name, 
      email, 
      avatar: picture 
    });
    
    res.json(authResponse(user));
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({ message: 'Google login failed' });
  }
});

// Helpers
function authResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  };
}

function formatMarketCap(cap) {
  if (!cap) return 'N/A';
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  return `$${Math.round(cap / 1e6)}M`;
}

// Server Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));