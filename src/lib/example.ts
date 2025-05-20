import type { FileNode } from '@/components/Editor/types/editor';

export const exampleFiles: FileNode[] = [
  {
    id: '1',
    name: 'index.html',
    type: 'file',
    value:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page 1</title>\n</head>\n<body>\n  <h1>Hola Mundo</h1>\n</body>\n</html>',
    language: 'html',
  },
  {
    id: '2',
    name: 'style.css',
    type: 'file',
    value: 'body {\n  background-color: #f0f0f0;\n}',
    language: 'css',
  },
  {
    id: '3',
    name: 'script.js',
    type: 'file',
    value: 'console.log("Hola Mundo");',
    language: 'javascript',
  },
];

export const monacoThemes = {
  // Tema inspirado en "One Dark Pro"
  'one-dark-pro': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'class-name', foreground: 'e5c07b' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'e06c75' },
      { token: 'operator', foreground: '56b6c2' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorCursor.foreground': '#528bff',
      'editor.lineHighlightBackground': '#2c313c',
      'editorLineNumber.foreground': '#495162',
      'editor.selectionBackground': '#3e4452',
      'editor.findMatchBackground': '#42557b',
    },
  },
  // Tema inspirado en "GitHub Light"
  'github-light': {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'string', foreground: '032f62' },
      { token: 'number', foreground: '005cc5' },
      { token: 'class-name', foreground: '6f42c1' },
      { token: 'function', foreground: '6f42c1' },
      { token: 'variable', foreground: '24292e' },
      { token: 'operator', foreground: 'd73a49' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',
      'editorCursor.foreground': '#044289',
      'editor.lineHighlightBackground': '#f6f8fa',
      'editorLineNumber.foreground': '#1b1f234d',
      'editor.selectionBackground': '#0366d625',
      'editor.findMatchBackground': '#ffdf5d66',
    },
  },
  // Tema inspirado en "Dracula"
  dracula: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'class-name', foreground: '8be9fd' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'operator', foreground: 'ff79c6' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#44475a',
      'editorLineNumber.foreground': '#6272a4',
      'editor.selectionBackground': '#44475a',
      'editor.findMatchBackground': '#ffb86c66',
    },
  },
};
