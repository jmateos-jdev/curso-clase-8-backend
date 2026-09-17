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

const socketPath = readEnv('INSTANCE_UNIX_SOCKET') || readEnv('DB_SOCKET')

const baseConfig = {
  user: readEnv('DB_USER', 'root'),
  password: readEnv('DB_PASSWORD', ''),
  database: readEnv('DB_NAME', 'curso_clase_8'),
  waitForConnections: true,
  connectionLimit: 10,
}

export const pool = mysql.createPool(
  socketPath
    ? { ...baseConfig, socketPath }
    : {
        ...baseConfig,
        host: readEnv('DB_HOST', 'localhost'),
        port: Number(readEnv('DB_PORT', '3306')),
        ssl: { rejectUnauthorized: false },
      },
)
