import { tursoClient } from '@/config/turso';
import { LibsqlError, type ResultSet } from '@libsql/client';
import { ConflictError, DBError } from '@/errors/errors';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images_url: string;
  project_id: string;
}

export class MessageDB {
  static async createMessage(message: Message): Promise<ResultSet> {
    const { role, text, images_url, project_id } = message;
    const id = crypto.randomUUID();
    const query = `INSERT INTO messages (id, role, text, images_url, project_id) VALUES (?, ?, ?, ?, ?)`;
    const params = [id, role, text, images_url, project_id];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      if (
        error instanceof LibsqlError &&
        error.message.includes('UNIQUE constraint failed: messages.id')
      ) {
        throw new ConflictError('Message already exists');
      }
      throw new DBError('Database error');
    }
  }

  static async getMessage(messageId: string): Promise<Message | null> {
    const query = `SELECT * FROM messages WHERE id = ?`;
    const params = [messageId];
    try {
      const result = await tursoClient.execute(query, params);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return {
        id: row.id?.toString() || '',
        role: row.role as 'user' | 'model',
        text: row.text?.toString() || '',
        images_url: row.images_url?.toString() || '',
        project_id: row.project_id?.toString() || '',
      };
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async updateMessage(message: Message): Promise<ResultSet> {
    const { id, role, text, images_url } = message;
    const query = `UPDATE messages SET role = ?, text = ?, images_url = ? WHERE id = ?`;
    const params = [role, text, images_url, id];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async deleteMessage(messageId: string): Promise<ResultSet> {
    const query = `DELETE FROM messages WHERE id = ?`;
    const params = [messageId];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async getMessagesByProjectId(projectId: string): Promise<Message[]> {
    const query = `SELECT * FROM messages WHERE project_id = ?`;
    const params = [projectId];
    try {
      const result = await tursoClient.execute(query, params);
      return result.rows.map(row => ({
        id: row.id?.toString() || '',
        role: row.role as 'user' | 'model',
        text: row.text?.toString() || '',
        images_url: row.images_url?.toString() || '',
        project_id: row.project_id?.toString() || '',
      }));
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async getLastMessage(projectId: string): Promise<Message[]> {
    const query = `SELECT * FROM messages WHERE project_id = ? ORDER BY rowid DESC LIMIT 1`;
    const params = [projectId];
    try {
      const result = await tursoClient.execute(query, params);
      return result.rows.map(row => ({
        id: row.id?.toString() || '',
        role: row.role as 'user' | 'model',
        text: row.text?.toString() || '',
        images_url: row.images_url?.toString() || '',
        project_id: row.project_id?.toString() || '',
      }));
    } catch (error) {
      throw new DBError('Database error');
    }
  }
  static async getHistory(projectId: string): Promise<Message[]> {
    const query = `SELECT * FROM messages WHERE project_id = ? ORDER BY rowid DESC LIMIT 5`;
    const params = [projectId];
    try {
      const result = await tursoClient.execute(query, params);
      let messages = result.rows.map(row => ({
        id: row.id?.toString() || '',
        role: row.role as 'user' | 'model',
        text: row.text?.toString() || '',
        images_url: row.images_url?.toString() || '',
        project_id: row.project_id?.toString() || '',
      }));
      messages = messages.reverse();
      if (messages.length > 0 && messages[0].role === 'model') {
        messages.shift();
      }
      return messages;
    } catch (error) {
      throw new DBError('Database error');
    }
  }
}
