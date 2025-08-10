const { neon } = require('@neondatabase/serverless');

// Aggiungi la stessa funzione di conversione
const convertConnectionString = (url) => {
  return url.replace('postgresql://', 'postgres://')
           .replace(/channel_binding=[^&]*&?/, '');
};

exports.handler = async (event) => {
  // 1. Converti la connection string
  const connectionString = convertConnectionString(process.env.DATABASE_URL);
  
  // 2. Configura connessione
  const sql = neon(connectionString);

  try {
    const { matchId, player1, player2, votedFor } = JSON.parse(event.body);
    
    await sql`
      INSERT INTO predictions (match_id, player1, player2, voted_for)
      VALUES (${matchId}, ${player1}, ${player2}, ${votedFor})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Voto salvato!" }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Save Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Errore nel salvataggio del voto",
        details: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};