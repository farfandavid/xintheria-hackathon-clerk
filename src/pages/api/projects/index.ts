import { chatFormSchema } from '@/components/chatform';
import { gemini } from '@/config/gemini';
import { MessageDB } from '@/db/message';
import { ProjectDB } from '@/db/project';
import { AppError, ErrorHandler, UnauthorizedError, ValidationError } from '@/errors/errors';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { userId } = locals.auth();
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    const dataForm = await request.formData();
    const file = dataForm.get('attachFile') as File;

    const { data, error } = chatFormSchema.safeParse({
      messages: JSON.parse(dataForm.get('messages') as string),
      model: dataForm.get('model') as string,
      attachFile: file instanceof File ? file : undefined,
      currentProjectId: dataForm.get('currentProjectId') as string,
      html: dataForm.get('html') as string,
      css: dataForm.get('css') as string,
      js: dataForm.get('js') as string,
    });

    if (error) throw new ValidationError('Invalid data', error.format());
    if (!data || !data.messages || data.messages.length === 0) {
      throw new AppError(400, 'No messages provided');
    }
    const createProject = await ProjectDB.createProject({
      id: '',
      user_id: userId,
      name: (await gemini.createShorTitle(data.messages[0].content)) || 'Project',
    });

    const resGemini = await gemini.createChat(data);

    await MessageDB.createMessage({
      id: '',
      role: 'user',
      text: data.messages[0].content,
      images_url: '',
      project_id: createProject.id || '',
    });
    await MessageDB.createMessage({
      id: '',
      role: 'model',
      text: resGemini.text || '',
      images_url: '',
      project_id: createProject.id || '',
    });
    return new Response(
      JSON.stringify({
        data: {
          id: createProject.id,
          name: createProject.name,
        },
        error: null,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
};

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    const { userId } = locals.auth();
    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }
    const projects = await ProjectDB.getAllProjectsByUserId(userId);
    return new Response(JSON.stringify({ data: projects, error: null }), {
      status: 200,
    });
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
};
