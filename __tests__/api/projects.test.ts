import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET, POST } from '@/pages/api/projects/index';
import { HTTP_STATUS } from '@/errors/errors';

vi.mock('@/db/project', () => ({
  ProjectDB: {
    getAllProjectsByUserId: vi.fn(),
    createProject: vi.fn(),
  },
}));

vi.mock('@/db/message', () => ({
  MessageDB: {
    createMessage: vi.fn(),
  },
}));

function expectBodyStructure(body: any) {
  expect(body).toHaveProperty('data');
  expect(body).toHaveProperty('error');
}
describe('GET /api/projects', () => {
  it('devuelve 401 si no hay usuario autenticado', async () => {
    const locals = { auth: () => ({ userId: null }) };
    const response = await GET({ locals } as any);
    expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    const body = await response.json();
    expectBodyStructure(body);
    expect(body.error.message).toBe('User not authenticated');
  });
});

describe('GET /api/projects', () => {
  it('devuelve 200 y la lista de proyectos si el usuario está autenticado', async () => {
    const mockProjects = [
      { id: '1', name: 'Project 1' },
      { id: '2', name: 'Project 2' },
    ];
    const locals = { auth: () => ({ userId: 'TEST' }) };
    const { ProjectDB } = await import('@/db/project');
    (ProjectDB.getAllProjectsByUserId as Mock).mockResolvedValue(mockProjects);
    const response = await GET({ locals } as any);
    expect(response.status).toBe(HTTP_STATUS.OK ?? 200); // Si tienes HTTP_STATUS.OK, si no, usa 200
    const body = await response.json();
    expectBodyStructure(body);
    expect(body.data).toEqual(mockProjects);
    expect(body.error).toBeNull();
  });
});

describe('POST /api/projects', () => {
  it('devuelve 400 si la validación falla', async () => {
    const locals = { auth: () => ({ userId: 'TEST' }) };
    const { ProjectDB } = await import('@/db/project');
    (ProjectDB.createProject as Mock).mockResolvedValue({
      id: '1',
      name: 'Project 1',
    });
    const { MessageDB } = await import('@/db/message');
    (MessageDB.createMessage as Mock).mockResolvedValue({
      id: '1',
      role: 'user',
      text: 'Test message',
      images_url: '',
      project_id: '1',
    });

    const form = new FormData();
    form.append(
      'messages',
      JSON.stringify([
        {
          role: 'user',
          content: 'Test message',
        },
      ])
    );
    form.append('model', 'test');
    form.append('attachFile', 'test');
    form.append('test', '');
    form.append('css', '');
    form.append('js', '');
    form.append('currentProjectId', '');

    const request = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: form,
    });
    const response = await POST({ locals, request } as any);
    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    const body = await response.json();
    expectBodyStructure(body);
    expect(body.error.message).toBe('Invalid data');
  });
});
