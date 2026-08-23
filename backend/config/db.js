import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ems_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * 🗄️ Database & Tables Auto-Initialization
 * Passwords are saved in plain text (as required for demo).
 */
export const initDB = async () => {
  try {
    // 1. Root connection to create DB if needed
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ems_db'}\`;`);
    await rootConnection.end();

    // 2. Table 1: USERS Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        department VARCHAR(100) DEFAULT 'Engineering',
        designation VARCHAR(100) DEFAULT 'Software Engineer',
        role ENUM('admin', 'employee') DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Table 2: RECORDS Table
    const createRecordsTable = `
      CREATE TABLE IF NOT EXISTS records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('attendance', 'leave') NOT NULL,
        date DATE NULL,
        from_date DATE NULL,
        to_date DATE NULL,
        status VARCHAR(50) NOT NULL,
        reason TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await pool.query(createUsersTable);
    await pool.query(createRecordsTable);

    // 4. Default Admin User (dhanarajpatil2008@gmail.com / 123456)
    const [existingAdmin] = await pool.query('SELECT * FROM users WHERE email = ?', ['dhanarajpatil2008@gmail.com']);
    if (existingAdmin.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, phone, department, designation, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Dhanaraj Patil', 'dhanarajpatil2008@gmail.com', '123456', '9876543210', 'Management', 'System Administrator', 'admin']
      );
      console.log('✅ Default Admin created: dhanarajpatil2008@gmail.com / 123456');
    }

    // 5. Default Employee User (dhanaraj@ems.com / user123)
    const [existingEmployee] = await pool.query('SELECT * FROM users WHERE email = ?', ['dhanaraj@ems.com']);
    if (existingEmployee.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password, phone, department, designation, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Dhanaraj Patil', 'dhanaraj@ems.com', 'user123', '9123456780', 'Information Technology', 'Full Stack Developer', 'employee']
      );
      console.log('✅ Default Employee created: dhanaraj@ems.com / user123');
    }

    console.log('🚀 MySQL Database & 2 Tables (users, records) are connected successfully!');
  } catch (error) {
    console.error('❌ Database Initialization Error:', error.message);
  }
};

export default pool;
