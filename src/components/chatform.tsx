import { z } from 'zod';

export const chatFormSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string().min(1, { message: 'Prompt is required' }).max(500, { message: 'Prompt must be less than 500 characters' }),
    })).optional(),
    model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'gemini'], {
        errorMap: () => ({ message: 'Model is required' }),
    }),
    attachFile: z.instanceof(File).refine(
        (file) => file.size <= 2 * 1024 * 1024,
        { message: 'File size exceeds 2MB limit' }
    ).refine(
        (file) => file.type.startsWith('image/'),
        { message: 'Only image files are allowed' }
    ).optional(),
    html: z.string().optional().nullable(),
    css: z.string().optional().nullable(),
    js: z.string().optional().nullable(),
    currentProjectId: z.string().optional(),
})

export type ChatFormSchema = z.infer<typeof chatFormSchema>;