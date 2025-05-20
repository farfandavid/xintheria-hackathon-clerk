import { chatFormSchema } from '@/components/chatform';
import { gemini } from '@/config/gemini';
import { MessageDB } from '@/db/message';
import { ProjectDB } from '@/db/project';
import { AppError, ErrorHandler, UnauthorizedError, ValidationError } from '@/errors/errors';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { userId } = locals.auth();
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    const project = await ProjectDB.getProjectById(params.id || '', userId);
    if (!project) {
      throw new AppError(404, 'Project not found');
    }
    const messages = await MessageDB.getMessagesByProjectId(project.id);
    if (!messages) {
      throw new AppError(404, 'Messages not found');
    }

    return new Response(JSON.stringify({ data: messages, error: null }), {
      status: 200,
    });
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { userId } = locals.auth();
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    const project = await ProjectDB.getProjectById(params.id || '', userId);
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    await ProjectDB.deleteProjectById(project.id, userId);

    return new Response(JSON.stringify({ data: null, error: null }), {
      status: 200,
    });
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  try {
    const { userId } = locals.auth();
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    const { data, error } = chatFormSchema.safeParse(await request.json());
    if (error) {
      throw new ValidationError('Invalid data', error.format());
    }
    if (!data || !data.messages || data.messages.length === 0) {
      throw new AppError(400, 'No messages provided');
    }
    const history = await MessageDB.getHistory(data.currentProjectId || '');
    const assistantMsg = await gemini.createChat(data, history);
    const project = await ProjectDB.getProjectById(params.id || '', userId);
    if (!project) {
      throw new AppError(404, 'Project not found');
    }
    await MessageDB.createMessage({
      id: '',
      role: data.messages[0].role,
      text: data.messages[0].content,
      images_url: '',
      project_id: project.id,
    });
    await MessageDB.createMessage({
      id: '',
      role: 'model',
      text: assistantMsg.text || '',
      images_url: '',
      project_id: project.id,
    });
    const getLast = await MessageDB.getLastMessage(project.id);
    return new Response(JSON.stringify({ data: getLast, error: null }), {
      status: 200,
    });
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
};
