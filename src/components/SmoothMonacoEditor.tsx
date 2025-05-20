import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Editor, { useMonaco, type Monaco } from '@monaco-editor/react';
import { Loader } from 'lucide-react';

interface SmoothMonacoEditorProps {
    language: string;
    value: string;
    theme?: string;
    options?: Record<string, any>;
    onChange?: (value: string | undefined) => void;
    onMount?: (editor: any, monaco: Monaco) => void;
}

export interface SmoothMonacoEditorRef {
    updateContent: (newContent: string) => void;
    updateLanguage: (newLanguage: string) => void;
    focus: () => void;
}

const SmoothMonacoEditor = forwardRef<SmoothMonacoEditorRef, SmoothMonacoEditorProps>(({
    language,
    value,
    theme = 'vs-dark',
    options = {},
    onChange,
    onMount,
}, ref) => {
    const editorRef = useRef<any>(null);
    const monaco = useMonaco();
    const contentRef = useRef<string>(value);

    const customThemes = {
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
            }
        },
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
            }
        },
        'dracula': {
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
            }
        },
        'xintheria-dark': {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '7f85a3', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'd67eea' },        // violeta
                { token: 'string', foreground: '84e1b8' },         // verde menta
                { token: 'number', foreground: 'e0a672' },         // durazno
                { token: 'class-name', foreground: 'f3d96b' },     // amarillo pastel
                { token: 'function', foreground: '82b4ff' },       // celeste claro
                { token: 'variable', foreground: 'ef7a93' },       // rosa fuerte
                { token: 'operator', foreground: '89d0e9' },       // azul cyan suave
            ],
            colors: {
                'editor.background': '#100d20',                   // fondo violeta oscuro
                'editor.foreground': '#d6d6e7',                   // texto gris claro
                'editorCursor.foreground': '#a882ff',             // cursor violeta
                'editor.lineHighlightBackground': '#2a2640',
                'editorLineNumber.foreground': '#595775',
                'editor.selectionBackground': '#3a335a',
                'editor.findMatchBackground': '#5e488d',
            }
        }
    };

    useImperativeHandle(ref, () => ({
        updateContent: (newContent: string) => {
            if (editorRef.current) {
                const model = editorRef.current.getModel();
                if (model) {
                    contentRef.current = newContent;
                    editorRef.current.executeEdits('content-update', [
                        {
                            range: model.getFullModelRange(),
                            text: newContent,
                            forceMoveMarkers: true
                        }
                    ]);
                }
            }
        },
        updateLanguage: (newLanguage: string) => {
            if (editorRef.current && monaco) {
                const model = editorRef.current.getModel();
                if (model) {
                    monaco.editor.setModelLanguage(model, newLanguage);
                }
            }
        },
        focus: () => {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        }
    }));

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;

        if (monaco && Object.keys(customThemes).length > 0) {
            Object.entries(customThemes).forEach(([themeName, themeConfig]) => {
                monaco.editor.defineTheme(themeName, {
                    base: themeConfig.base as any,
                    inherit: themeConfig.inherit,
                    rules: themeConfig.rules,
                    colors: themeConfig.colors,
                });
            });

            monaco.editor.setTheme(theme);
        }

        if (onMount) {
            onMount(editor, monaco);
        }
    };

    const isUserEditRef = useRef(false);

    useEffect(() => {
        if (editorRef.current && value !== contentRef.current && !isUserEditRef.current) {
            contentRef.current = value;
            const model = editorRef.current.getModel();
            if (model) {
                const currentContent = editorRef.current.getValue();
                if (currentContent !== value) {
                    editorRef.current.executeEdits('external-content-update', [
                        {
                            range: model.getFullModelRange(),
                            text: value,
                            forceMoveMarkers: true
                        }
                    ]);
                }
            }
        }
        isUserEditRef.current = false;
    }, [value]);

    useEffect(() => {
        if (monaco && theme) {
            monaco.editor.setTheme(theme);
        }
    }, [monaco, theme]);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            isUserEditRef.current = true;
            contentRef.current = value;
            if (onChange) {
                onChange(value);
            }
        }
    };

    return (
        <Editor
            defaultLanguage={language}
            defaultValue={value}
            theme={theme}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                ...options
            }}
            loading={<div className="flex justify-center items-center h-full"><Loader className="animate-spin" /></div>}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
        />
    );
});

SmoothMonacoEditor.displayName = 'SmoothMonacoEditor';

export default SmoothMonacoEditor;
