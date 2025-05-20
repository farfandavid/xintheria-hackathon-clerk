import { createClient } from '@libsql/client';

/* async function migrateDB() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
 await client.execute(`ALTER TABLE messages RENAME TO messages_old`);
  await client.execute(`CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
    text TEXT NOT NULL,
    images_url TEXT,
    project_id TEXT NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`); 
  await client.execute(`
    INSERT INTO messages (id, role, text, images_url, project_id)
    SELECT id, role, text, images_url, project_id FROM messages_old;
  `);

  await client.execute(`DROP TABLE messages_old;`);

  console.log('Migración completada: ON DELETE CASCADE agregado a messages.');
} */

async function initDB() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        role TEXT CHECK(role IN ('user', 'model')) NOT NULL,
        text TEXT NOT NULL,
        images_url TEXT,
        project_id TEXT NOT NULL,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      )`,
    ];
    for (const sql of tables) {
      await client.execute(sql);
    }
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();
//migrateDB();
