const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();
  try {
    await client.query('ALTER PUBLICATION supabase_realtime ADD TABLE "Event";');
    console.log('Realtime enabled for Event table');
  } catch (e) {
    if (e.message.includes('already in publication')) {
      console.log('Already in publication');
    } else {
      console.error('Error:', e.message);
    }
  }
  await client.end();
}
run();
