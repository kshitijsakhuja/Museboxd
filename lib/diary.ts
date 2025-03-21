import { db } from "@/lib/db"; // Import database connection
import { DiaryEntry } from "@/types"; // Import DiaryEntry type

// Fetch a diary entry by ID
export const getDiaryEntryById = async (id: string): Promise<DiaryEntry | null> => {
  const [rows] = await db.execute("SELECT * FROM diary_entries WHERE id = ?", [id]);
  return (rows as DiaryEntry[])[0] || null;
};

// Add a new diary entry
export const addDiaryEntry = async (entry: DiaryEntry) => {
  const { id, itemId, itemType, rating, review, title, artist, imageUrl } = entry;
  await db.execute(
    "INSERT INTO diary_entries (id, itemId, itemType, rating, review, title, artist, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, itemId, itemType, rating, review, title, artist, imageUrl]
  );
  return { success: true };
};

// Update a diary entry
export const updateDiaryEntry = async (id: string, data: { rating: number; review: string }) => {
  const { rating, review } = data;
  await db.execute("UPDATE diary_entries SET rating = ?, review = ? WHERE id = ?", [rating, review, id]);
  return { success: true };
};

// Delete a diary entry
export const deleteDiaryEntry = async (id: string) => {
  await db.execute("DELETE FROM diary_entries WHERE id = ?", [id]);
  return { success: true };
};

// Fetch all diary entries (optional)
export const getAllDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const [rows] = await db.execute("SELECT * FROM diary_entries ORDER BY title ASC");
  return rows as DiaryEntry[];
};
