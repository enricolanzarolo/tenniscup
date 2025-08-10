// netlify/functions/save-vote.js
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  // Configura la connessione al DB
  const sql = neon(process.env.DATABASE_URL);

  try {
    const { matchId, player1, player2, votedFor } = JSON.parse(event.body);
    
    await sql`
      INSERT INTO predictions (match_id, player1, player2, voted_for)
      VALUES (${matchId}, ${player1}, ${player2}, ${votedFor})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Voto salvato!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nel salvataggio del voto" }),
    };
  }
};