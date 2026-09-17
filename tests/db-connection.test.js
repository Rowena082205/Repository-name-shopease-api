const mongoose = require('mongoose');

test('MongoDB test connection works', async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    serverSelectionTimeoutMS: 15000,
    runtimeAdapters: { os: require('os') }
  });

  expect(mongoose.connection.readyState).toBe(1);

  await mongoose.disconnect();
});
