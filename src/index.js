import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { pool } from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/api/contador', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ID AS id, VALOR AS valor FROM contador ORDER BY ID DESC',
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al listar los registros' })
  }
})

app.post('/api/contador', async (req, res) => {
  try {
    const valor = Number(req.body?.valor)

    if (!Number.isInteger(valor) || valor < 0) {
      return res.status(400).json({
        error: 'El valor debe ser un entero mayor o igual a 0',
      })
    }

    const [result] = await pool.query(
      'INSERT INTO contador (VALOR) VALUES (?)',
      [valor],
    )

    res.status(201).json({
      id: result.insertId,
      valor,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear el registro' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
