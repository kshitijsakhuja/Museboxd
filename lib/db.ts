import mysql from "mysql2/promise";

// Create a MySQL connection pool
export const db = mysql.createPool({
  host: "localhost",       // Change to your MySQL host
  user: "root",       // Your MySQL username
  password: "root", // Your MySQL password
  database: "museboxd_diary", // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
