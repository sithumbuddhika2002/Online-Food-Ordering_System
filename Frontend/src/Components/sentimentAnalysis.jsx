import { SentimentIntensityAnalyzer } from 'vader-sentiment';

const keywords = {
    food: [
      'food', 'taste', 'dish', 'meal', 'cuisine', 'flavor', 'delicious', 'spicy', 'sweet', 'savory', 'appetizer', 'entree', 'dessert', 'gourmet', 'palate', 'recipe', 'ingredient'
    ],
    service: [
      'service', 'waiter', 'staff', 'server', 'hospitality', 'attentive', 'friendly', 'rude', 'helpful', 'courteous', 'professional', 'unfriendly', 'polite', 'efficient', 'inattentive'
    ],
    price: [
      'price', 'expensive', 'cheap', 'value for money', 'cost', 'affordable', 'overpriced', 'reasonable', 'budget', 'economical', 'costly', 'inexpensive', 'worth', 'rate', 'charge'
    ],
    cleanliness: [
      'clean', 'hygiene', 'dirty', 'tidy', 'sanitary', 'spotless', 'filthy', 'neat', 'sterile', 'grimy', 'immaculate', 'messy', 'pristine', 'unsanitary', 'disinfected'
    ],
    drink: [
      'drink', 'beverage', 'cocktail', 'coffee', 'tea', 'juice', 'wine', 'beer', 'soda', 'mocktail', 'smoothie', 'espresso', 'latte', 'brew', 'refreshment'
    ],
    ambiance: [
      'atmosphere', 'vibe', 'ambiance', 'environment', 'decor', 'setting', 'music', 'lighting', 'mood', 'aura', 'decorum', 'aesthetic', 'feel', 'tone', 'ambience'
    ],
    speed: [
      'waiting', 'slow', 'quick', 'fast', 'delay', 'prompt', 'timely', 'speedy', 'lag', 'swift', 'hasty', 'leisurely', 'brisk', 'unhurried', 'expeditious'
    ],
    location: [
      'location', 'convenient', 'hard to find', 'accessible', 'nearby', 'distance', 'parking', 'proximity', 'remote', 'central', 'isolated', 'reachable', 'situated', 'locale', 'spot'
    ],
    staff: [
      'friendly', 'rude', 'helpful', 'attitude', 'polite', 'courteous', 'unfriendly', 'professional', 'welcoming', 'hostile', 'accommodating', 'gracious', 'impolite', 'kind', 'disrespectful'
    ],
    variety: [
      'variety', 'selection', 'options', 'choice', 'range', 'menu', 'assortment', 'diversity', 'different', 'unique'
    ],
    quality: [
      'quality', 'standard', 'excellent', 'superior', 'high', 'poor', 'bad', 'good', 'mediocre', 'top-notch'
    ],
    presentation: [
      'presentation', 'plating', 'look', 'appearance', 'visual', 'garnish', 'style', 'arrangement', 'design'
    ],
    experience: [
      'experience', 'enjoyment', 'satisfaction', 'memorable', 'impression', 'overall', 'enjoyed', 'time', 'visit'
    ],
    specialRequests: [
      'request', 'accommodation', 'dietary', 'preferences', 'allergies', 'custom', 'modify', 'change', 'special'
    ],
    promotions: [
      'deal', 'promotion', 'discount', 'offer', 'coupon', 'sale', 'special', 'bargain', 'price cut'
    ],
    reservation: [
      'reservation', 'booking', 'schedule', 'confirm', 'availability', 'waitlist', 'seating', 'time'
    ],
    payment: [
      'payment', 'transaction', 'checkout', 'bill', 'invoice', 'method', 'credit card', 'cash', 'receipt'
    ],
    feedback: [
      'feedback', 'suggestion', 'comment', 'recommendation', 'review', 'input', 'critique', 'opinion', 'thoughts'
    ],
    comfort: [
      'comfort', 'cozy', 'relaxing', 'seating', 'space', 'roomy', 'crowded', 'comfortable', 'uncomfortable'
    ]
};

export const analyzeSentiment = (review) => {
  if (!review) return 'No review provided.';
  console.log(review);

  // Get the sentiment score using VADER
  const sentimentResult = SentimentIntensityAnalyzer.polarity_scores(review);
  const { compound } = sentimentResult;

  const lowerCaseReview = review.toLowerCase();

  // Function to check if any keyword from a category is in the review
  const containsKeyword = (category) => keywords[category].some(keyword => lowerCaseReview.includes(keyword));

  // Specific keyword-based analysis for each category
  const responses = {
    food: {
      positive: "We're glad you loved the food! Is there anything you want to share with us !",
      negative: "Sorry to hear the food didn’t meet your expectations. Could you let us know which dish you had?",
      neutral: "Thanks for your feedback on the food! Is there any improvements you'd like?"
    },
    service: {
      positive: "Happy to hear the service was excellent! We hope to serve you again soon.",
      negative: "We’re sorry if the service was not up to par. Could you share more about your experience so we can improve?",
      neutral: "Thanks for sharing your thoughts about the service! Any specific area you'd like to highlight?"
    },
    price: {
      positive: "We're happy that you found our pricing reasonable! Let us know if there’s anything else we can assist with.",
      negative: "We apologize if the prices felt too high. We strive to offer the best value possible, and your feedback is important.",
      neutral: "Thanks for your thoughts on our pricing! Do you feel there’s any way we could improve?"
    },
    cleanliness: {
      positive: "We're glad you found everything clean and hygienic! We take cleanliness seriously.",
      negative: "We're sorry to hear about cleanliness issues. Could you provide more details so we can address them?",
      neutral: "Thanks for mentioning cleanliness! We always aim to keep things spotless."
    },
    drink: {
      positive: "We're happy to know you enjoyed the drinks! Any specific cocktail or beverage you'd recommend?",
      negative: "We're sorry the drinks didn’t meet your expectations. Could you let us know what went wrong?",
      neutral: "Thanks for your thoughts on the drinks! We're always working to improve our beverages."
    },
    ambiance: {
      positive: "We're thrilled that you loved the atmosphere! We hope it added to your overall experience.",
      negative: "We're sorry if the atmosphere wasn't to your liking. Any suggestions on how we could improve it?",
      neutral: "Thanks for sharing your thoughts on the ambiance! We'd love to hear if you have any suggestions."
    },
    speed: {
      positive: "We're happy that the service was quick! We always aim to serve you promptly.",
      negative: "We apologize for any delays you experienced. We're working on improving our speed.",
      neutral: "Thanks for your feedback on the speed! Is there any specific area where you felt improvement is needed?"
    },
    location: {
      positive: "We're glad you found our location convenient! We hope to see you again soon.",
      negative: "Sorry to hear you had trouble finding us. We'll work on providing clearer directions.",
      neutral: "Thanks for mentioning the location! We appreciate your thoughts."
    },
    staff: {
      positive: "We're glad our staff made a positive impression! We appreciate your kind words.",
      negative: "We're sorry to hear about your experience with our staff. Your feedback is important to us.",
      neutral: "Thanks for sharing your thoughts about the staff! Any specific comments you’d like to provide?"
    },
    variety: {
      positive: "We're pleased you enjoyed our variety of options! What was your favorite?",
      negative: "We're sorry to hear that you didn’t find enough variety. Any suggestions on what you would like to see?",
      neutral: "Thanks for your input on our variety! We're always looking to expand our offerings."
    },
    quality: {
      positive: "We're glad to hear you found the quality of our food/service exceptional!",
      negative: "We’re sorry to hear that the quality didn't meet your expectations. Could you provide details?",
      neutral: "Thanks for sharing your thoughts on quality! Your feedback helps us improve."
    },
    presentation: {
      positive: "We're thrilled that you enjoyed the presentation of your dish! It’s something we take pride in.",
      negative: "We're sorry if the presentation didn't meet your expectations. Any specific feedback?",
      neutral: "Thanks for mentioning the presentation! We strive to make our dishes visually appealing."
    },
    experience: {
      positive: "We're glad to hear you had a memorable experience! We look forward to serving you again.",
      negative: "We’re sorry to hear that your experience wasn’t great. Your feedback is valuable for us.",
      neutral: "Thanks for sharing your experience! Any specific highlights or areas for improvement?"
    },
    specialRequests: {
      positive: "We're happy to accommodate special requests! We appreciate your feedback.",
      negative: "We apologize if we couldn’t fulfill your special requests. Could you share more details?",
      neutral: "Thanks for mentioning special requests! We strive to meet our customers' needs."
    },
    promotions: {
      positive: "We're glad you liked our promotions! We love offering good deals.",
      negative: "We're sorry to hear that our promotions didn’t meet your expectations. Any suggestions?",
      neutral: "Thanks for sharing your thoughts on promotions! We're always working to improve."
    },
    reservation: {
      positive: "We're pleased you found our reservation process smooth! We hope to see you again soon.",
      negative: "We’re sorry if you had issues with reservations. Your feedback helps us improve.",
      neutral: "Thanks for mentioning our reservation system! Any suggestions for improvement?"
    },
    payment: {
      positive: "We're glad you found our payment process convenient!",
      negative: "We apologize if you faced any issues with payment. Your feedback is important to us.",
      neutral: "Thanks for your thoughts on payment! We’re always looking to improve."
    },
    feedback: {
      positive: "We appreciate your positive feedback! It motivates us to do even better.",
      negative: "We're sorry to hear about your concerns. Your feedback is essential for our improvement.",
      neutral: "Thanks for your feedback! We're always looking to enhance our service."
    },
    comfort: {
      positive: "We're thrilled to know you found the place comfortable!",
      negative: "We're sorry if you felt uncomfortable. Your experience is important to us.",
      neutral: "Thanks for mentioning comfort! We strive to create a cozy atmosphere."
    }
  };

  const detectedCategories = Object.keys(keywords).filter(category => containsKeyword(category));

  if (detectedCategories.length === 0) {
    return "Thanks for your feedback.";
  }

  // Select the first detected category
  const selectedCategory = detectedCategories[0];

  // Provide responses based on sentiment and the first detected category
  const selectedResponse = responses[selectedCategory];
  
  if (compound >= 0.05) {
    return selectedResponse.positive || "Thank you for your positive feedback!";
  } else if (compound <= -0.05) {
    return selectedResponse.negative || "We're sorry to hear about your experience. We appreciate your feedback.";
  } else {
    return selectedResponse.neutral || "Thank you for your feedback!";
  }
};
