import { tursoClient } from '@/config/turso';
import { DBError, ConflictError } from '@/errors/errors';
import { LibsqlError, type ResultSet } from '@libsql/client';

export interface User {
  id: string;
}

export class UserDB {
  static async createUser(user: User): Promise<ResultSet> {
    const { id } = user;
    const query = `INSERT INTO users (id) VALUES (?)`;
    const params = [id];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      if (error instanceof LibsqlError && error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictError('User already exists');
      }
      throw new DBError('Database error');
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = ?`;
    const params = [userId];
    try {
      if (!userId) {
        throw new ConflictError('User not found');
      }
      if (userId.length === 0) {
        throw new ConflictError('User not found');
      }
      const result = await tursoClient.execute(query, params);
      if (result.rows.length === 0) {
        return null;
      }
      if (result.rows[0].id === null) {
        throw new ConflictError('User not found');
      }
      const user: User = {
        id: result.rows[0].id.toString() || '',
      };
      return user;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new DBError('Database error');
    }
  }

  static async updateUser(user: User): Promise<ResultSet> {
    const { id } = user;
    const query = `UPDATE users SET id = ? WHERE id = ?`;
    const params = [id, id];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async deleteUser(userId: string): Promise<ResultSet> {
    const query = `DELETE FROM users WHERE id = ?`;
    const params = [userId];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async getAllUsers(): Promise<ResultSet> {
    const query = `SELECT * FROM users`;
    try {
      return await tursoClient.execute(query);
    } catch (error) {
      throw new DBError('Database error');
    }
  }
}
