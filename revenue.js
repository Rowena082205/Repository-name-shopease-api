const Order = require('./models/Order');
const Product = require('./models/Product');

async function run() {
  const revenueByCategory = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productInfo'
      }
    },
    { $unwind: '$productInfo' },
    {
      $group: {
        _id: '$productInfo.category',
        totalRevenue: {
          $sum: {
            $multiply: ['$items.price', '$items.qty']
          }
        }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  console.log(revenueByCategory);
}

run();
