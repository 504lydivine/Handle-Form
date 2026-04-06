import mysql from 'mysql2/promise';

async function seedDatabase() {
    let connection;
    try {
        // 1. Connect to MariaDB (No password)
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', 
            database: 'my_app_db'
        });

        console.log("🌱 Connected! Preparing to insert 100 users...");

        // 2. Optional: Clear existing users so you don't get duplicates
        // await connection.execute('DELETE FROM users'); 

        // 3. Loop 100 times
        for (let i = 1; i <= 100; i++) {
            const name = `User ${i}`;
            const email = `user${i}@example.com`;
            const password = `pass${i}123`;

            await connection.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, password]
            );

            // Log progress every 20 users
            if (i % 20 === 0) console.log(`...inserted ${i} users`);
        }

        console.log("✅ Successfully inserted 100 users into 'my_app_db'!");

    } catch (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error("❌ Error: The database 'my_app_db' does not exist. Create it first in MariaDB!");
        } else if (err.code === 'ER_NO_SUCH_TABLE') {
            console.error("❌ Error: The 'users' table does not exist. Run your CREATE TABLE command first!");
        } else {
            console.error("❌ Unexpected Error:", err.message);
        }
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

seedDatabase();