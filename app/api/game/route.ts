import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
// GET endpoint to fetch leaderboard
export async function GET(request: NextRequest) {
    try {
        const result = await pool.query('SELECT * FROM leaderboard ORDER BY points DESC');
        return NextResponse.json({ leaderboard: result.rows });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}

// POST endpoint to create a new result
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_name, points } = body;

        const result = await pool.query(
            'INSERT INTO leaderboard (user_name, points) VALUES ($1, $2) RETURNING *',
            [user_name, points]
        );

        return NextResponse.json({ result: result.rows[0] });
    } catch (error) {
        console.error('Error creating result:', error);
        return NextResponse.json({ error: 'Failed to create result' }, { status: 500 });
    }
}



