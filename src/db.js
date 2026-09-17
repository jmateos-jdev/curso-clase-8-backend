import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env')
const env = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {}

function readEnv(name, fallback = '') {
  return env[name] ?? process.env[name] ?? fallback
}

export const pool = mysql.createPool({
  host: readEnv('DB_HOST', 'localhost'),
  port: Number(readEnv('DB_PORT', '3306')),
  user: readEnv('DB_USER', 'root'),
  password: readEnv('DB_PASSWORD', ''),
  database: readEnv('DB_NAME', 'curso_clase_8'),
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
})
