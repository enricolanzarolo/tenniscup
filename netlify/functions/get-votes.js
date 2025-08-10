const { neon } = require('@neondatabase/serverless');

// Aggiungi questa conversione PRIMA dell'handler
const convertConnectionString = (url) => {
  return url.replace('postgresql://', 'postgres://')
           .replace(/channel_binding=[^&]*&?/, '');
};

exports.handler = async (event) => {
  // 1. Converti la connection string
  const connectionString = convertConnectionString(process.env.DATABASE_URL);
  
  // 2. Configura connessione
  const sql = neon(connectionString);
  
  // 3. Estrai parametro
  const { matchId } = event.queryStringParameters;

  // 4. Esegui query
  try {
    const result = await sql`
      SELECT * FROM predictions 
      WHERE match_id = ${matchId}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    };
  } catch (error) {
    console.error('DB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Database error",
        details: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};