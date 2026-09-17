require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const plan = await Product.find({ category: 'Electronics' }).explain('executionStats');
  console.log(JSON.stringify(plan.executionStats.executionStages, null, 2));
  await mongoose.disconnect();
})();
