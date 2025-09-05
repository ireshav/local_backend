require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Provider = require('./models/Provider');

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected for seeding.');

  // Create demo user
  const pw = await bcrypt.hash('password123', 10);
  const user = await User.findOneAndUpdate({ email: 'demo@example.com' }, {
    name: 'Demo User', email: 'demo@example.com', password: pw
  }, { upsert: true, new: true });
  console.log('User created/updated:', user.email);

  const providers = [
    { name: 'Sparkle Cleaners', category: 'Cleaning', price: 25, description: 'Professional cleaning services.' },
    { name: 'QuickFix Plumbing', category: 'Plumbing', price: 50, description: 'Fast plumbing repairs.' },
    { name: 'Bright Tutors', category: 'Education', price: 30, description: 'One-on-one tutoring.' }
  ];

  for(const p of providers){
    await Provider.findOneAndUpdate({ name: p.name }, p, { upsert: true });
    console.log('Seeded provider:', p.name);
  }

  mongoose.disconnect();
  console.log('Seeding complete.');
}

main().catch(err => { console.error(err); process.exit(1); });
