// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config()

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

console.log("process.env.DB_NAME:", process.env.DB_NAME)

connection.connect(err => {
  if (err) {
    console.error('MySQLga ulanishda xatolik:', err)
    return
  }
  console.log('✅ MySQLga muvaffaqiyatli ulandi!')
})

export default connection
