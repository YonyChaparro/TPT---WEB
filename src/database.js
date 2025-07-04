import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './src/database.db', // o './database.db' si está en raíz
  driver: sqlite3.Database
});

const pool = {
  query: async (sql, params = []) => {
    const db = await dbPromise;
    const trimmed = sql.trim().toLowerCase();

    if (trimmed.startsWith('select')) {
      const rows = await db.all(sql, params);
      return [rows]; // Simula [rows] de mysql2
    } else {
      const result = await db.run(sql, params);
      return [result];
    }
  }
};

export default pool; // 👈 ¡IMPORTANTE!
