import { Archive, ArrowLeftFromLine, ArrowRightFromLine, ChevronLeft, ChevronLeftSquare, FileCode, LucideChevronLeftSquare } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react";
import { Separator } from "../ui/separator";
import type { FileNode } from "./types/editor";
import { DevIcons } from "./utils/icons";

interface ExplorerProps {
    files?: FileNode[];
    onSelectFile?: (file: FileNode) => void;
}

export const Explorer = ({ files, onSelectFile }: ExplorerProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleFileClick = (file: FileNode) => {
        if (onSelectFile) {
            onSelectFile(file);
        }
    }
    return (
        <div className={`border-l ${isOpen ? 'w-56 min-w-56' : 'w-14 min-w-14'} transition-[min-width] duration-300 ease-in-out`}>
            <div className="flex items-center justify-between p-2">
                <h1 className="font-bold flex items-center gap-1" hidden={!isOpen}>
                    <Archive className="w-4 h-4" />
                    <span >Explorer</span>
                </h1>
                <Button variant={"ghost"} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen && <ArrowLeftFromLine />}
                    {!isOpen && <ArrowRightFromLine />}
                </Button>
            </div>
            <Separator></Separator>
            <div>
                <div className="flex flex-col p-2">
                    <ul className="space-y-1">
                        {files?.map((file) => (
                            <li key={file.id} className="text-sm text-muted-foreground">
                                <Button variant={'ghost'} size={'sm'} className="w-full flex justify-start" onClick={() => handleFileClick(file)}>{DevIcons[file.name.split('.').pop() as keyof typeof DevIcons]} <span hidden={!isOpen}>{file.name}</span></Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}