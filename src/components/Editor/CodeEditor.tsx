import { useRef, useState } from "react";
import { Explorer } from "./Explorer";
import { MenubarEditor } from "./Menubar";
import type { EditorThemes, FileNode } from "./types/editor";
import { Editor, type OnChange } from '@monaco-editor/react';
import { editorThemes } from "./utils/editorThemes";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CodeEditorProps {
    files?: FileNode[];
    onChangeFile?: (file: FileNode) => void;
    selectedFile?: string;
    onChangeSelectedFile?: (id: string) => void;
    themes?: EditorThemes;
    defaultTheme?: string;
}


export default function CodeEditor({ files, themes = editorThemes, defaultTheme = 'one-dark-pro', onChangeFile, selectedFile, onChangeSelectedFile }: CodeEditorProps) {

    const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);
    const [currentFile, setCurrentFile] = useState<FileNode | null>(
        files?.find(v => v.id === selectedFile) ?? null
    );
    const editorRef = useRef<any>(null);

    const handleChange: OnChange = (value, event) => {
        if (selectedFile) {
            const updatedFile = { ...files?.find(v => v.id === selectedFile), value };
            if (onChangeFile) {
                onChangeFile({
                    id: selectedFile,
                    name: updatedFile?.name ?? '',
                    type: updatedFile?.type ?? 'file',
                    value: updatedFile?.value,
                    language: updatedFile?.language,
                    children: updatedFile?.children,
                });
            }
        }
    }

    const handleSelectFile = (file: FileNode) => {
        setCurrentFile(file);
        if (onChangeSelectedFile) {
            onChangeSelectedFile(file.id);
        }
    }

    const handleDownload = async () => {
        if (!files || files.length === 0) return;

        const zip = new JSZip();

        const addFilesToZip = (fileList: FileNode[], path = "") => {
            fileList.forEach(file => {
                if (file.type === "file") {
                    zip.file(`${path}${file.name}`, file.value || "");
                } else if (file.type === "folder" && file.children) {
                    addFilesToZip(file.children, `${path}${file.name}/`);
                }
            });
        };

        addFilesToZip(files);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "project.zip");
    }
    return (
        <div className="flex flex-col h-full">
            <MenubarEditor onDownload={handleDownload} themes={themes} onChangeTheme={setCurrentTheme}></MenubarEditor>
            <div className="flex flex-row h-full">
                <Explorer files={files} onSelectFile={handleSelectFile}></Explorer>
                <div className="w-full border-2">
                    <Editor

                        beforeMount={(monaco) => {
                            if (themes) {
                                Object.entries(themes).forEach(([themeName, theme]) => {
                                    monaco.editor.defineTheme(themeName, {
                                        ...theme,
                                        base: theme.base as 'vs' | 'vs-dark' | 'hc-black' | 'hc-light',
                                    });
                                });
                            }
                        }}
                        options={{
                            readOnly: files?.find(v => v.id === selectedFile) ? false : true,
                        }}
                        theme={currentTheme}
                        onMount={(editor) => (editorRef.current = editor)}
                        language={files?.find(v => v.id === selectedFile)?.language ?? 'plaintext'}
                        value={files?.find(v => v.id === selectedFile)?.value ?? '// Select a file to edit or Start a new chat'}
                        onChange={handleChange}

                    ></Editor>
                </div>
            </div>
        </div>
    )
}