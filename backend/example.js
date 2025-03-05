const { categorizeTransaction } = require('./utils/categorize');

// Example transaction descriptions
const descriptions = [
  "Invested in mutual funds",
  "Invested in Cryptocurrencies",
  "Bought a new Laptop",
  "spent on clothing",
  "giving gift to my girlfriend",
  "Auto rickshaw fare to college",
  "Canteen lunch at college",
];

// Classify each description
(async () => {
  for (const desc of descriptions) {
    const category = await categorizeTransaction(desc);
    console.log(`Description: ${desc} | Category: ${category}`);
  }
})();