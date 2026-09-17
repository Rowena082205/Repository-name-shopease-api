const { sequelize, Category, Product } = require('./models');

async function main() {
  let queryCount = 0;

  sequelize.addHook('afterQuery', () => queryCount++);

  const categories = await Category.findAll();

  for (const cat of categories) {
    await Product.findAll({ where: { categoryId: cat.id } });
  }

  console.log('BAD approach total queries:', queryCount);

  queryCount = 0;

  await Category.findAll({ include: Product });

  console.log('GOOD approach total queries:', queryCount);

  process.exit();
}

main();
