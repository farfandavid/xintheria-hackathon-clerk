import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowLeftFromLine, FileClock, MessageSquareCode, Plus, Trash } from "lucide-react";
import { UserButton, SignedIn } from "@clerk/astro/react"
import { dark } from '@clerk/themes';
import { $userStore } from '@clerk/astro/client'
import { useStore } from "@nanostores/react";
import { theme } from "@/stores/themeStore";
import type { Project } from "@/types/chat";
import { toast } from "sonner";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onChangeProject: (project: Project | null) => void;
    onDeleteProject?: (projectId: string) => Promise<void>;
    projects?: Project[];
}

export const SidebarApp = ({ isOpen, onClose, projects, onChangeProject, onDeleteProject }: SidebarProps) => {
    const $theme = useStore(theme)
    const sidebarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleDeleteProject = (projectId: string) => {
        toast.warning('Are you sure you want to delete this project?', {
            position: 'top-center',
            richColors: true,
            dismissible: true,
            actionButtonStyle: {
                backgroundColor: 'red',
            },
            action: {
                label: 'Delete',
                onClick: async () => {
                    toast.promise(
                        async () => {
                            await onDeleteProject?.(projectId)
                        }, {
                        loading: 'Deleting project...',
                        success: 'Project deleted',
                        error: 'Error deleting project',
                    })
                }
            },
            duration: 5000,
        }
        )
    }

    return (
        <div
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-sidebar shadow-xl`}
        >
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <MessageSquareCode />
                    <h2>AI Astro Generator</h2>
                </div>
                <Button variant={"ghost"} className="border h-10 w-10" onClick={onClose}>
                    <ArrowLeftFromLine />
                </Button>
            </div>
            {/* Chats History */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-muted-foreground">Recents Projects</h3>
                    <Button variant={"ghost"} className="aspect-square" size={"sm"} onClick={() => onChangeProject(null)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-1">
                    {projects?.map((project) => (
                        <div key={project.id + "project"} className="flex justify-between" >
                            <Button variant={"ghost"} className="justify-start" size={"sm"} onClick={() => onChangeProject(project)}>
                                <FileClock></FileClock>
                                <span className="ml-2">{project.name}</span>
                            </Button>
                            <Button variant={"ghost"} className="aspect-square hover:bg-destructive hover:text-pink-200" size={"sm"}
                                onClick={() => handleDeleteProject(project.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                    ))}
                </div>
            </div>
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <SignedIn >
                            <UserButton
                                appearance={{
                                    baseTheme: $theme === "dark" ? dark : undefined,
                                }}
                                userProfileProps={{
                                    appearance: {
                                        baseTheme: $theme === "dark" ? dark : undefined,
                                    }
                                }} />
                            <span>{$userStore.get()?.fullName}</span>
                        </SignedIn>
                    </div>
                </div>
                {/** Powered By */}
            </div>
        </div>
    )
}