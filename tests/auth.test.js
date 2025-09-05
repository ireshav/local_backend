const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const appModule = require('../src/app');
const User = require('../src/models/User');

let mongod, app, server;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  // require app (it will connect when run directly), but we use exported app and startServer
  const mod = require('../src/app');
  app = mod.app;
  await mongoose.connect(process.env.MONGO_URI);
  server = app.listen(0); // random free port
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await server.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

test('register and login flow', async () => {
  const user = { name: 'Test', email: 't@example.com', password: 'pass123' };
  const res = await request(app).post('/api/auth/register').send(user);
  expect(res.statusCode).toBe(201);
  expect(res.body.user).toHaveProperty('email', user.email);

  const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
  expect(login.statusCode).toBe(200);
  expect(login.body).toHaveProperty('token');
});
