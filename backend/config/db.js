import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// In-Memory / File Persistent Mock Database State for zero-downtime fallback
const fallbackDataFile = path.resolve('local_db_backup.json');

const initialDatabaseState = {
  users: [
    {
      id: 1,
      name: 'Dhanaraj Patil',
      email: 'dhanarajpatil2008@gmail.com',
      password: '123456',
      phone: '9876543210',
      department: 'Management',
      designation: 'System Administrator',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Dhanaraj Patil',
      email: 'dhanaraj@ems.com',
      password: 'user123',
      phone: '9123456780',
      department: 'Information Technology',
      designation: 'Full Stack Developer',
      role: 'employee',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Rahul Sharma',
      email: 'rahul@ems.com',
      password: 'password123',
      phone: '9876501234',
      department: 'Information Technology',
      designation: 'Backend Developer',
      role: 'employee',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Sneha Kulkarni',
      email: 'sneha@ems.com',
      password: 'password123',
      phone: '9876505678',
      department: 'Human Resources',
      designation: 'HR Specialist',
      role: 'employee',
      created_at: new Date().toISOString()
    }
  ],
  records: [
    {
      id: 1,
      user_id: 2,
      type: 'attendance',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: 'On time',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 3,
      type: 'attendance',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: 'On time',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 4,
      type: 'attendance',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: 'On time',
      created_at: new Date().toISOString()
    }
  ],
  nextUserId: 5,
  nextRecordId: 4
};

// Load saved data if exists
let memoryDB = { ...initialDatabaseState };
try {
  if (fs.existsSync(fallbackDataFile)) {
    const saved = JSON.parse(fs.readFileSync(fallbackDataFile, 'utf8'));
    if (saved.users && saved.records) {
      memoryDB = saved;
    }
  }
} catch (e) {
  // Use initial state
}

const saveMemoryDB = () => {
  try {
    fs.writeFileSync(fallbackDataFile, JSON.stringify(memoryDB, null, 2), 'utf8');
  } catch (e) {
    // ignore
  }
};

let useMemoryFallback = false;

// 1. MySQL Real Connection Pool
let realPool = null;
try {
  realPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ems_db',
    port: Number(process.env.DB_PORT) || 3306,
    ssl: (process.env.DB_SSL === 'true' || process.env.DB_PORT === '14143') ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 4000
  });
} catch (err) {
  useMemoryFallback = true;
}

// 2. Query Executor with seamless automatic fallback
export const executeQuery = async (sql, params = []) => {
  if (!useMemoryFallback && realPool) {
    try {
      const result = await realPool.query(sql, params);
      return result;
    } catch (mysqlErr) {
      console.warn('⚠️ MySQL connection issue, switching to high-availability storage fallback:', mysqlErr.message);
      useMemoryFallback = true;
    }
  }

  // ==========================================
  // ⚡ Memory Fallback Query Engine
  // ==========================================
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  // SELECT * FROM users WHERE email = ?
  if (/SELECT \* FROM users WHERE email = \?/i.test(cleanSql)) {
    const user = memoryDB.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
    return [user ? [user] : []];
  }

  // SELECT id, name, email, phone, department, designation, role, created_at FROM users WHERE id = ?
  if (/SELECT .* FROM users WHERE id = \?/i.test(cleanSql)) {
    const user = memoryDB.users.find(u => u.id === Number(params[0]));
    return [user ? [user] : []];
  }

  // SELECT * FROM users ORDER BY id DESC (getAll)
  if (/SELECT .* FROM users.*ORDER BY id DESC/i.test(cleanSql)) {
    return [[...memoryDB.users].reverse()];
  }

  // INSERT INTO users
  if (/INSERT INTO users/i.test(cleanSql)) {
    const [name, email, password, phone, department, designation, role] = params;
    const newId = memoryDB.nextUserId++;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      phone: phone || '',
      department: department || 'Information Technology',
      designation: designation || 'Associate Engineer',
      role: role || 'employee',
      created_at: new Date().toISOString()
    };
    memoryDB.users.push(newUser);
    saveMemoryDB();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  // UPDATE users
  if (/UPDATE users/i.test(cleanSql)) {
    const id = params[params.length - 1];
    const userIndex = memoryDB.users.findIndex(u => u.id === Number(id));
    if (userIndex !== -1) {
      if (params.length === 8) {
        const [name, email, password, phone, department, designation, role] = params;
        memoryDB.users[userIndex] = {
          ...memoryDB.users[userIndex],
          name,
          email,
          password,
          phone,
          department,
          designation,
          role
        };
      } else {
        const [name, email, phone, department, designation, role] = params;
        memoryDB.users[userIndex] = {
          ...memoryDB.users[userIndex],
          name,
          email,
          phone,
          department,
          designation,
          role
        };
      }
      saveMemoryDB();
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // DELETE FROM users
  if (/DELETE FROM users WHERE id = \?/i.test(cleanSql)) {
    const id = Number(params[0]);
    memoryDB.users = memoryDB.users.filter(u => u.id !== id);
    memoryDB.records = memoryDB.records.filter(r => r.user_id !== id);
    saveMemoryDB();
    return [{ affectedRows: 1 }];
  }

  // SELECT department, COUNT(*) as employee_count FROM users WHERE role = 'employee' GROUP BY department
  if (/GROUP BY department/i.test(cleanSql)) {
    const deptMap = {};
    memoryDB.users.filter(u => u.role === 'employee').forEach(u => {
      deptMap[u.department] = (deptMap[u.department] || 0) + 1;
    });
    const rows = Object.keys(deptMap).map(d => ({ department: d, employee_count: deptMap[d], count: deptMap[d] }));
    return [rows];
  }

  // SELECT ... FROM users WHERE role = 'employee' ORDER BY name ASC
  if (/FROM users WHERE role = 'employee' ORDER BY name ASC/i.test(cleanSql)) {
    const emps = memoryDB.users.filter(u => u.role === 'employee').sort((a, b) => a.name.localeCompare(b.name));
    return [emps];
  }

  // Attendance & Records Queries
  if (/SELECT id FROM records WHERE user_id = \? AND type = 'attendance' AND date = \?/i.test(cleanSql)) {
    const [userId, date] = params;
    const rec = memoryDB.records.find(r => r.user_id === Number(userId) && r.type === 'attendance' && r.date === date);
    return [rec ? [rec] : []];
  }

  if (/UPDATE records SET status = \?, reason = \? WHERE id = \?/i.test(cleanSql)) {
    const [status, reason, id] = params;
    const rec = memoryDB.records.find(r => r.id === Number(id));
    if (rec) {
      rec.status = status;
      rec.reason = reason;
      saveMemoryDB();
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  if (/INSERT INTO records/i.test(cleanSql)) {
    const newId = memoryDB.nextRecordId++;
    if (/from_date/i.test(cleanSql)) {
      const [userId, from_date, to_date, reason] = params;
      memoryDB.records.push({
        id: newId,
        user_id: Number(userId),
        type: 'leave',
        from_date,
        to_date,
        status: 'Pending',
        reason: reason || '',
        created_at: new Date().toISOString()
      });
    } else {
      const [userId, date, status, reason] = params;
      memoryDB.records.push({
        id: newId,
        user_id: Number(userId),
        type: 'attendance',
        date,
        status,
        reason: reason || '',
        created_at: new Date().toISOString()
      });
    }
    saveMemoryDB();
    return [{ insertId: newId, affectedRows: 1 }];
  }

  // Get attendance by date for admin
  if (/SELECT.*FROM users u.*LEFT JOIN records r/i.test(cleanSql)) {
    const targetDate = params[0];
    const rows = memoryDB.users.filter(u => u.role === 'employee').map(u => {
      const rec = memoryDB.records.find(r => r.user_id === u.id && r.type === 'attendance' && r.date === targetDate);
      return {
        user_id: u.id,
        name: u.name,
        email: u.email,
        department: u.department,
        designation: u.designation,
        record_id: rec ? rec.id : null,
        status: rec ? rec.status : 'Not Marked',
        reason: rec ? rec.reason : null,
        date: targetDate
      };
    });
    return [rows];
  }

  // Get leaves for admin
  if (/SELECT.*FROM records r.*JOIN users u.*WHERE r.type = 'leave'/i.test(cleanSql)) {
    const leaves = memoryDB.records.filter(r => r.type === 'leave').map(r => {
      const u = memoryDB.users.find(usr => usr.id === r.user_id) || {};
      return {
        id: r.id,
        user_id: r.user_id,
        name: u.name || 'Employee',
        email: u.email || '',
        department: u.department || 'General',
        from_date: r.from_date,
        to_date: r.to_date,
        status: r.status,
        reason: r.reason,
        created_at: r.created_at
      };
    }).reverse();
    return [leaves];
  }

  // Admin Dashboard stats
  if (/COUNT\(\*\) as total_employees/i.test(cleanSql)) {
    const count = memoryDB.users.filter(u => u.role === 'employee').length;
    return [[{ total_employees: count }]];
  }
  if (/COUNT\(DISTINCT department\) as total_departments/i.test(cleanSql)) {
    const depts = new Set(memoryDB.users.filter(u => u.role === 'employee').map(u => u.department));
    return [[{ total_departments: depts.size }]];
  }
  if (/COUNT\(\*\) as present_count/i.test(cleanSql)) {
    const today = params[0] || new Date().toISOString().split('T')[0];
    const count = memoryDB.records.filter(r => r.type === 'attendance' && r.date === today && r.status === 'Present').length;
    return [[{ present_count: count }]];
  }
  if (/COUNT\(\*\) as pending_leaves/i.test(cleanSql)) {
    const count = memoryDB.records.filter(r => r.type === 'leave' && r.status === 'Pending').length;
    return [[{ pending_leaves: count }]];
  }

  // Employee stats
  if (/WHERE user_id = \? AND type = 'attendance' AND status = 'Present'/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const count = memoryDB.records.filter(r => r.user_id === userId && r.type === 'attendance' && r.status === 'Present').length;
    return [[{ total_present: count }]];
  }
  if (/WHERE user_id = \? AND type = 'attendance' AND status = 'Absent'/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const count = memoryDB.records.filter(r => r.user_id === userId && r.type === 'attendance' && r.status === 'Absent').length;
    return [[{ total_absent: count }]];
  }
  if (/WHERE user_id = \? AND type = 'leave' GROUP BY status/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const userLeaves = memoryDB.records.filter(r => r.user_id === userId && r.type === 'leave');
    const counts = {};
    userLeaves.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
    const rows = Object.keys(counts).map(s => ({ status: s, count: counts[s] }));
    return [rows];
  }
  if (/WHERE user_id = \? AND type = 'leave' ORDER BY created_at DESC/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const userLeaves = memoryDB.records.filter(r => r.user_id === userId && r.type === 'leave').reverse();
    return [userLeaves];
  }
  if (/WHERE user_id = \? AND type = 'attendance' ORDER BY date DESC/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const userAtt = memoryDB.records.filter(r => r.user_id === userId && r.type === 'attendance').sort((a,b) => b.date.localeCompare(a.date));
    return [userAtt];
  }
  if (/UPDATE records SET status = \? WHERE id = \? AND type = 'leave'/i.test(cleanSql)) {
    const [status, id] = params;
    const rec = memoryDB.records.find(r => r.id === Number(id) && r.type === 'leave');
    if (rec) {
      rec.status = status;
      saveMemoryDB();
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  return [[]];
};

const pool = {
  query: executeQuery
};

/**
 * 🗄️ Database & Tables Auto-Initialization
 */
export const initDB = async () => {
  try {
    if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost') {
      const rootConnection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: Number(process.env.DB_PORT) || 3306,
        connectTimeout: 4000
      });
      await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ems_db'}\`;`);
      await rootConnection.end();
    }

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

    await realPool.query(createUsersTable);
    await realPool.query(createRecordsTable);

    const [existingAdmin] = await realPool.query('SELECT * FROM users WHERE email = ?', ['dhanarajpatil2008@gmail.com']);
    if (existingAdmin.length === 0) {
      await realPool.query(
        `INSERT INTO users (name, email, password, phone, department, designation, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Dhanaraj Patil', 'dhanarajpatil2008@gmail.com', '123456', '9876543210', 'Management', 'System Administrator', 'admin']
      );
    }

    const [existingEmployee] = await realPool.query('SELECT * FROM users WHERE email = ?', ['dhanaraj@ems.com']);
    if (existingEmployee.length === 0) {
      await realPool.query(
        `INSERT INTO users (name, email, password, phone, department, designation, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Dhanaraj Patil', 'dhanaraj@ems.com', 'user123', '9123456780', 'Information Technology', 'Full Stack Developer', 'employee']
      );
    }

    console.log('🚀 MySQL Database & 2 Tables (users, records) are connected successfully!');
  } catch (error) {
    console.warn('⚠️ Cloud MySQL is standby/offline. Switched to In-Memory High-Availability Storage engine:', error.message);
    useMemoryFallback = true;
  }
};

export default pool;
