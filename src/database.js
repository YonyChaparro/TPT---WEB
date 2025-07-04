// database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './src/database.db',
  driver: sqlite3.Database
});

const pool = {
  query: async (sql, params = []) => {
    const db = await dbPromise;
    const lowered = sql.trim().toLowerCase();

    // SELECT
    if (lowered.startsWith('select')) {
      const rows = await db.all(sql, params);
      return [rows]; // Simula [rows] de MySQL
    }

    // INSERT / UPDATE / DELETE con `SET ?`
    if (sql.includes('SET ?')) {
      const match = sql.match(/SET\s+\?/i);
      if (match) {
        const obj = params[0];
        const keys = Object.keys(obj);
        const placeholders = keys.map(k => `${k} = ?`).join(', ');
        const newSql = sql.replace('SET ?', `SET ${placeholders}`);
        const values = keys.map(k => obj[k]);
        const dbRes = await db.run(newSql, values);
        return [dbRes];
      }
    }

    // Otros comandos
    const result = await db.run(sql, params);
    return [result];
  }
};

export default pool;
