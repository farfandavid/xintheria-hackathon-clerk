import { BrainCircuit, Image, Paperclip, RefreshCcw, RefreshCw, Send, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useState } from "react";
import { truncateText } from "@/lib/utils";
import { toast } from "sonner";
import type { Project } from "@/types/chat";
import type { FileNode } from "./Editor/types/editor";
import { chatFormSchema, type ChatFormSchema } from "./chatform";

interface InputAreaProps {
    currentProject?: Project;
    onCreateProject?: (project: ChatFormSchema) => Promise<void>;
    onSendMessage?: (message: ChatFormSchema) => Promise<void>;
    files?: FileNode[];
    isSending: boolean;
}

export const InputArea = ({ currentProject, files, onCreateProject, onSendMessage, isSending }: InputAreaProps) => {
    const [attachFile, setAttachFile] = useState<File | null>(null);
    const [aiModel, setAiModel] = useState<string>("gemini");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { data, error } = chatFormSchema.safeParse({
            messages: [
                {
                    role: "user",
                    content: formData.get("prompt") as string,
                }
            ],
            model: aiModel,
            attachFile: attachFile || undefined,
            html: files?.find((file) => file.language === "html")?.value,
            css: files?.find((file) => file.language === "css")?.value,
            js: files?.find((file) => file.language === "javascript")?.value,
            currentProjectId: currentProject?.id,
        })

        if (error) {
            error.errors.forEach((err) => {
                toast.error(err.message);
            });
            return;
        }
        if (!currentProject) {
            setIsLoading(true);
            await onCreateProject?.(data);
            setIsLoading(false);
        }
        handleSendMessage(data);
    }
    const handleSendMessage = async (message: ChatFormSchema) => {
        if (!currentProject) return;
        await onSendMessage?.({
            model: message.model,
            messages: message.messages,
            attachFile: message.attachFile,
            html: message.html,
            css: message.css,
            js: message.js,
            currentProjectId: currentProject.id,
        });
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2MB limit.");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }

        setAttachFile(file);
    }
    return (
        <form className="p-4 relative w-full" onSubmit={handleSubmit}>
            <div className="border border-input h-32 rounded-lg focus-within:border-ring text-base shadow-border shadow-xs bg-input/30 outline-none focus-within:ring-ring/50 focus-within:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm p-2">
                <textarea className="w-full resize-none outline-none" rows={3} name="prompt" minLength={1} maxLength={500}></textarea>
            </div>
            <div className="absolute right-6 bottom-2 transform -translate-y-1/2 flex items-center gap-2">
                <DropdownMenu >
                    <DropdownMenuTrigger className="border border-border rounded-lg p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 w-10 h-10">
                        <BrainCircuit className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="text-sm">Use</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={aiModel} onValueChange={setAiModel}>
                            <DropdownMenuRadioItem value="gemini">
                                <span className="ml-2 text-xs">Gemini</span>
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="border border-border rounded-lg hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 p-2 relative h-10 w-10 flex items-center justify-center">
                    <label htmlFor="file" className="absolute w-full h-full flex items-center justify-center">
                        <Paperclip className="h-4 w-4" />
                    </label>
                    <input type="file" id="file" name="attachFile" className="hidden" onChange={handleFileChange} multiple={false} accept="image/*" />
                </div>
                <Button type="submit" disabled={isLoading || isSending} >
                    {isLoading || isSending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-white" />}
                </Button>
            </div>
            {attachFile && <div className="absolute left-6 bottom-4 transform -translate-y-1/2 flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded-md text-xs px-2 py-1">
                    <Image className="h-4 w-4" />
                    <span>{truncateText(attachFile.name)}</span>
                    <Button type="button" variant="ghost" size={'icon'} className="h-4 w-4"
                        onClick={() => setAttachFile(null)}>
                        <X className="h-2 w-2" />
                    </Button>
                </div>
            </div>}
        </form>
    )
}