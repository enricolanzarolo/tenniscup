// netlify/functions/get-votes.js
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  // 1. Configura connessione
  const sql = neon(process.env.DATABASE_URL);
  
  // 2. Estrai parametro
  const { matchId } = event.queryStringParameters;

  // 3. Esegui query
  try {
    const result = await sql`
      SELECT * FROM predictions 
      WHERE match_id = ${matchId}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error" }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};