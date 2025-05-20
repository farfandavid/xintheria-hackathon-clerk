import { Bot, Code, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { chatFormSchema, type ChatFormSchema } from "./chatform";
import type { FileNode } from "./Editor/types/editor";
import { InputArea } from "./InputArea";
import type { Message, Project } from "@/types/chat";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface PanelChatProps {
    messages: Message[] | [];
    onFilesChange?: (files: FileNode[]) => void;
    viewCode: (code: string) => void;
    files?: FileNode[];
    onSendMessage?: (message: ChatFormSchema) => Promise<void>;
    currentProject?: Project;
    isSending: boolean
}

function plainTextToMarkdown(text: string) {
    return text
}

function splitMarkdownBlocks(markdown: string) {
    const regex = /```(\w+)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    const blocks: { type: 'text' | 'html' | 'css' | 'js', content: string }[] = [];

    while ((match = regex.exec(markdown)) !== null) {
        if (match.index > lastIndex) {
            blocks.push({
                type: 'text',
                content: markdown.slice(lastIndex, match.index).trim()
            });
        }
        const lang = match[1] as 'html' | 'css' | 'js';
        blocks.push({
            type: lang,
            content: match[2].trim()
        });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < markdown.length) {
        blocks.push({
            type: 'text',
            content: markdown.slice(lastIndex).trim()
        });
    }
    return blocks.filter(b => b.content.length > 0);
}

export const PanelChat = ({ messages, onFilesChange, viewCode, files, currentProject, onSendMessage, isSending }: PanelChatProps) => {
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isSending, messages.length]);
    function parseBlocksToFiles(blocks: { type: 'text' | 'html' | 'css' | 'js', content: string }[]): FileNode[] {
        return blocks
            .filter(block => block.type !== 'text')
            .map(block => ({
                id: block.type === 'html' ? '1' : block.type === 'css' ? '2' : '3',
                name: block.type === 'js' ? 'script.js' : block.type === 'css' ? 'style.css' : 'index.html',
                type: 'file',
                language: block.type === 'js' ? 'javascript' : block.type,
                value: block.content,
            }))
    }
    const handleViewCode = (code: string) => {
        const blocks = splitMarkdownBlocks(code)

        onFilesChange?.(
            parseBlocksToFiles(blocks)
        )
        toast('Mensaje seleccionado', {
            description: "El mensaje ha sido seleccionado para editar y enviar",
        });
        viewCode('code');
    }
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-center p-4 gap-2 border-b border-border font-bold text-xl h-16 max-h-16">
                <Bot></Bot>
                <h1>Chat</h1>
            </div>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-muted-foreground">No hay mensajes aún</p>
                        <p className="text-muted-foreground">Escribe algo para empezar a chatear</p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={message.id} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-primary text-white' : 'bg-transparent border border-border'}`}>
                        {splitMarkdownBlocks(message.text).map((md, index) => {
                            return (
                                <div key={message.id + "block" + index} className="flex flex-col gap-2">
                                    {md.type === 'text' && <p>{plainTextToMarkdown(md.content)}</p>}
                                    {md.type === 'html' && <Card className="flex justify-center items-center bg-orange-500 text-white font-black" >HTML</Card>}
                                    {md.type === 'css' && <Card className="flex justify-center items-center bg-sky-500 font-black text-white" >CSS</Card>}
                                    {md.type === 'js' && <Card className="flex justify-center items-center text-white font-black bg-yellow-500" >JS</Card>}
                                </div>
                            )
                        })}
                        {message.role === 'model' &&
                            <div className="flex gap-2" key={message.id + "button"}>
                                <div className="mt-2 py-1 flex-1/2 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex justify-center items-center" >
                                    <Checkbox id={message.id + "slt"} className="mr-2" checked={message.id === selectedMessage}
                                        onClick={() => {
                                            if (selectedMessage === message.id) {
                                                setSelectedMessage(null);
                                                toast('Mensaje deseleccionado');
                                                onFilesChange?.([]);
                                                return;
                                            }
                                            setSelectedMessage(message.id);
                                            handleViewCode(message.text);
                                        }} />
                                    <label htmlFor={message.id + "slt"}>Select</label>
                                </div>
                            </div>
                        }

                    </div>
                ))}
                {isSending &&
                    <div className="flex w-full justify-center items-center">
                        <RefreshCw className="animate-spin"></RefreshCw>
                    </div>
                }
                <div ref={endRef}></div>
            </div>
            {/* Input area */}
            <InputArea isSending={isSending} files={files} currentProject={currentProject} onSendMessage={onSendMessage} />
        </div>
    )
}