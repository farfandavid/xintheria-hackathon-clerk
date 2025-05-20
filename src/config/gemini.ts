import { GEMINI_API_KEY } from 'astro:env/server';
import {
  createModelContent,
  createUserContent,
  GenerateContentResponse,
  GoogleGenAI,
  type Content,
} from '@google/genai';
import type { ChatFormSchema } from '@/components/chatform';

const systemInstruction = `
- Detect the user's language and reply in the same language.
- You are a programming assistant. Your task is to help developers generate code examples in HTML, CSS, and JavaScript.
- Provide clear, concise, and easy-to-understand code.
- Reply using Markdown.
- Structure your answer with three code blocks: one for HTML, one for CSS, and one for JavaScript.
- Use proper code fences: \`\`\`html, \`\`\`css, and \`\`\`js.
- You can include short explanations or messages between code blocks if needed.
- Do not wrap the code in any JSON object or array.
- Do not include additional comments outside the code unless between blocks.
- Only return the code blocks and short messages in Markdown.
- Always include a short message before the code blocks to explain what the code does.
- Always include <link rel="stylesheet" href="style.css" /> in the HTML code block.
- Always include <script src="script.js"></script> in the HTML code block.
- For icons use Bootstrap icons, add <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"> and use the class bi bi-icon-name.
- Always include HTML if the user asks for CSS or JS.
- If the user asks for a web page, include HTML, CSS, and JS.
Example response:

Here is a simple web page that shows an alert with the input value:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Input Alert</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <input type="text" id="input" placeholder="Type something..." />
      <button onclick="showAlert()">Show Alert</button>
    </div>
    <script src="script.js"></script>
  </body>
</html>
\`\`\`

\`\`\`css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
}

input, button {
  padding: 10px;
  font-size: 16px;
  margin: 5px;
}
\`\`\`

\`\`\`js
function showAlert() {
  const value = document.getElementById('input').value;
  alert('You entered: ' + value);
}
\`\`\`
`;
export class AIGemini {
  private gemini: GoogleGenAI;
  private systemInstruction: string;
  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this.systemInstruction = systemInstruction;
  }

  createChat = async (
    message: ChatFormSchema,
    history?: Content[]
  ): Promise<GenerateContentResponse> => {
    const chat = this.gemini.chats.create({
      model: 'gemini-2.0-flash',
      history: history,
      config: {
        temperature: 0.5,
        systemInstruction: this.systemInstruction,
        responseMimeType: 'text/plain',
      },
    });
    return await chat.sendMessage({
      message: JSON.stringify(message),
    });
  };

  createChatStream = async (
    message: string,
    history?: Content[]
  ): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const chat = this.gemini.chats.create({
      model: 'gemini-2.0-flash',
      history: history,
      config: {
        temperature: 0.5,
        systemInstruction: this.systemInstruction,
        responseMimeType: 'text/plain',
      },
    });
    return await chat.sendMessageStream({
      message: message,
    });
  };

  createShorTitle = async (message: string) => {
    const chat = await this.gemini.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        createUserContent({
          text: message,
        }),
      ],
      config: {
        maxOutputTokens: 20,
        temperature: 0.5,
        systemInstruction:
          'Generate a short title in 4 word or less for the following text. Detect the language and reply in the same language. Simple and clear. Not using any special characters or emojis.',
        responseMimeType: 'text/plain',
      },
    });
    return chat.text;
  };
}

export const gemini = new AIGemini();
