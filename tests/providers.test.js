const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const appModule = require('../src/app');
const Provider = require('../src/models/Provider');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mongod, app, server, token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  const mod = require('../src/app');
  app = mod.app;
  await mongoose.connect(process.env.MONGO_URI);
  server = app.listen(0);

  // create a test user and token
  const pw = await bcrypt.hash('pass123', 10);
  const user = await User.create({ name: 'Auth', email: 'a@a.com', password: pw });
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await server.close();
});

afterEach(async () => {
  await Provider.deleteMany({});
});

test('create and list providers', async () => {
  const createRes = await request(app)
    .post('/api/providers')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'P1', category: 'Cleaning', price: 20 });
  expect([201,200]).toContain(createRes.statusCode);

  const listRes = await request(app).get('/api/providers');
  expect(listRes.statusCode).toBe(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.some(p => p.name === 'P1')).toBe(true);
});
