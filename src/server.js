// Lightweight server wrapper (optional). Prefer using `npm run dev` which starts src/app.js directly.
require('dotenv').config();
const app = require('./app'); // app.js exports Express app and handles DB connect by default
const PORT = process.env.PORT || 5000;
app.startServer(PORT); // startServer will be defined in app.js
