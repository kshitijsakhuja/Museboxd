import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "museboxd_diary",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Execute SQL queries
export async function executeQuery<T = any>({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  try {
    const [results] = await pool.execute(query, values);
    return results as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// User types
export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

// Diary entry types
export interface DiaryEntry {
  id?: number;
  user_id: number;
  title: string;
  artist: string;
  image_url?: string;
  rating?: number;
  review?: string;
  created_at?: Date;
}

// CRUD operations for diary entries
export async function createDiaryEntry(entry: DiaryEntry) {
  const query = `
    INSERT INTO diary_entries 
    (user_id, title, artist, image_url, rating, review, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    entry.user_id,
    entry.title,
    entry.artist,
    entry.image_url || null,
    entry.rating || null,
    entry.review || null,
  ];

  const result = await executeQuery<{ insertId: number }>({ query, values });
  return result.insertId;
}

export async function getDiaryEntriesByUserId(user_id: number) {
  const query = `
    SELECT * FROM diary_entries 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  return await executeQuery<DiaryEntry[]>({ query, values: [user_id] });
}

export async function getDiaryEntryById(id: number) {
  const query = `
    SELECT * FROM diary_entries 
    WHERE id = ?
  `;

  const result = await executeQuery<DiaryEntry[]>({ query, values: [id] });
  return result.length ? result[0] : null;
}

export async function updateDiaryEntry(id: number, entry: Partial<DiaryEntry>) {
  const fields = Object.keys(entry)
    .filter((key) => key !== "id" && key !== "user_id" && key !== "created_at")
    .map((key) => `${key} = ?`);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const values = Object.keys(entry)
    .filter((key) => key !== "id" && key !== "user_id" && key !== "created_at")
    .map((key) => (entry as any)[key]);

  const query = `
    UPDATE diary_entries 
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  return await executeQuery<{ affectedRows: number }>({
    query,
    values: [...values, id],
  });
}

export async function deleteDiaryEntry(id: number) {
  const query = `
    DELETE FROM diary_entries 
    WHERE id = ?
  `;

  return await executeQuery<{ affectedRows: number }>({
    query,
    values: [id],
  });
}

// CRUD operations for users
export async function createUser(user: User) {
  const query = `
    INSERT INTO users 
    (username, email, password_hash, created_at) 
    VALUES (?, ?, ?, NOW())
  `;

  const values = [
    user.username,
    user.email,
    user.password_hash,
  ];

  const result = await executeQuery<{ insertId: number }>({ query, values });
  return result.insertId;
}

export async function getUserById(id: number) {
  const query = `
    SELECT * FROM users 
    WHERE id = ?
  `;

  const result = await executeQuery<User[]>({ query, values: [id] });
  return result.length ? result[0] : null;
}

export async function updateUser(id: number, user: Partial<User>) {
  const fields = Object.keys(user)
    .filter((key) => key !== "id" && key !== "created_at")
    .map((key) => `${key} = ?`);

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const values = Object.keys(user)
    .filter((key) => key !== "id" && key !== "created_at")
    .map((key) => (user as any)[key]);

  const query = `
    UPDATE users 
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  return await executeQuery<{ affectedRows: number }>({
    query,
    values: [...values, id],
  });
}

export async function deleteUser(id: number) {
  const query = `
    DELETE FROM users 
    WHERE id = ?
  `;

  return await executeQuery<{ affectedRows: number }>({
    query,
    values: [id],
  });
}