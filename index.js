import 'dotenv/config'; // Loads your .env file automatically
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors()); 
app.use(express.json()); 

// 2. Database Connection using .env variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 3. Start Server & Test Connection
async function startServer() {
  try {
    // Testing the connection
    await pool.query('SELECT 1');
    console.log(`✅ Database '${process.env.DB_NAME}' Connected Successfully`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database Connection Failed:', err.message);
  }
}

// --- API ROUTES ---

// [CREATE] Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or database error" });
  }
});

// [READ] Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// [UPDATE] Edit Profile
app.put('/api/update-profile', async (req, res) => {
  const { name, email, newPassword } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, password = ? WHERE email = ?',
      [name, newPassword, email]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "No changes made or user not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// [DELETE] Delete Account
app.delete('/api/delete-account', async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE email = ?', [email]);
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

startServer();