const natural = require('natural');
const path = require('path');

// Create a promise to load the classifier
const classifierPromise = new Promise((resolve, reject) => {
  natural.BayesClassifier.load(path.join(__dirname,'..', 'models', 'classifier.json'), null, (err, classifier) => {
    if (err) {
      console.error('Error loading classifier:', err);
      reject(err);
    } else {
      console.log('Classifier loaded successfully');
      resolve(classifier);
    }
  });
});

// Function to categorize a transaction
async function categorizeTransaction(description) {
  try {
    const classifier = await classifierPromise; // Wait for the classifier to load
    const category = classifier.classify(description);
    console.log(`Natural classification for "${description}": ${category}`);
    return category || 'Miscellaneous';
  } catch (error) {
    console.error('Error with natural classification:', error.message);
    // Fallback logic if classification fails
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('coffee') || lowerDesc.includes('restaurant')) return 'Food';
    if (lowerDesc.includes('rent') || lowerDesc.includes('hostel')) return 'Housing';
    if (lowerDesc.includes('salary') || lowerDesc.includes('allowance')) return 'Income';
    return 'Miscellaneous';
  }
}

// Export the function
module.exports = { categorizeTransaction };