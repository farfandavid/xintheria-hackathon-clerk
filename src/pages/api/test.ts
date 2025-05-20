import { gemini } from '@/config/gemini';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const res = await gemini.createChatStream(
    'Me puedes crear una página web que muestre un formulario para enviar un correo. Estilizado'
  );
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of res) {
        const encodedChunk = encoder.encode(chunk.text);
        controller.enqueue(encodedChunk);
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
