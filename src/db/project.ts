import { tursoClient } from '@/config/turso';
import { LibsqlError, type ResultSet } from '@libsql/client';
import { ConflictError, DBError } from '@/errors/errors';

interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export class ProjectDB {
  static async createProject(project: Project): Promise<Project> {
    const { name, user_id } = project;
    const id = crypto.randomUUID();
    const query = `INSERT INTO projects (id, name, user_id) VALUES (?, ?, ?)`;
    const params = [id, name, user_id];
    try {
      const insertProject = await tursoClient.execute(query, params);
      if (insertProject.rowsAffected === 0) throw new DBError('Failed to create project');
      const selectQuery = `SELECT * FROM projects WHERE id = ?`;
      const selectParams = [id];
      const result = await tursoClient.execute(selectQuery, selectParams);
      return {
        id: result.rows[0].id?.toString() || '',
        name: result.rows[0].name?.toString() || '',
        user_id: result.rows[0].user_id?.toString() || '',
        created_at: result.rows[0].created_at?.toString() || '',
        updated_at: result.rows[0].updated_at?.toString() || '',
      };
    } catch (error) {
      if (
        error instanceof LibsqlError &&
        error.message.includes('UNIQUE constraint failed: projects.id')
      ) {
        throw new ConflictError('Project already exists');
      }
      throw new DBError('Database error');
    }
  }

  static async getProject(projectId: string): Promise<Project | null> {
    const query = `SELECT * FROM projects WHERE id = ?`;
    const params = [projectId];
    try {
      const result = await tursoClient.execute(query, params);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return {
        id: row.id?.toString() || '',
        name: row.name?.toString() || '',
        user_id: row.user_id?.toString() || '',
        created_at: row.created_at?.toString() || '',
        updated_at: row.updated_at?.toString() || '',
      };
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async updateProject(project: Project): Promise<ResultSet> {
    const { id, name } = project;
    const query = `UPDATE projects SET name = ? WHERE id = ?`;
    const params = [name, id];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async deleteProject(projectId: string): Promise<ResultSet> {
    const query = `DELETE FROM projects WHERE id = ?`;
    const params = [projectId];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }
  static async getProjectById(projectId: string, userId: string): Promise<Project | null> {
    const query = `SELECT * FROM projects WHERE id = ? AND user_id = ?`;
    const params = [projectId, userId];
    try {
      const result = await tursoClient.execute(query, params);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return {
        id: row.id?.toString() || '',
        name: row.name?.toString() || '',
        user_id: row.user_id?.toString() || '',
        created_at: row.created_at?.toString() || '',
        updated_at: row.updated_at?.toString() || '',
      };
    } catch (error) {
      throw new DBError('Database error');
    }
  }
  static async getAllProjectsByUserId(userId: string): Promise<Project[]> {
    const query = `SELECT * FROM projects WHERE user_id = ?`;
    const params = [userId];
    try {
      const result = await tursoClient.execute(query, params);
      return result.rows.map((row: any) => ({
        id: row.id?.toString() || '',
        name: row.name?.toString() || '',
        user_id: row.user_id?.toString() || '',
        created_at: row.created_at?.toString() || '',
        updated_at: row.updated_at?.toString() || '',
      }));
    } catch (error) {
      throw new DBError('Database error');
    }
  }

  static async deleteProjectById(projectId: string, userId: string): Promise<ResultSet> {
    const query = `DELETE FROM projects WHERE id = ? AND user_id = ?`;
    const params = [projectId, userId];
    try {
      return await tursoClient.execute(query, params);
    } catch (error) {
      throw new DBError('Database error');
    }
  }
}
