import { AppWindow, Car, Menu, MessageCircleCodeIcon, RefreshCcw, RefreshCw, SquareCode } from "lucide-react";
import { SidebarApp } from "../SidebarApp";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelChat } from "../PanelChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import Preview from "../Preview";
import CodeEditor from "../Editor/CodeEditor";
import { editorThemes } from "../Editor/utils/editorThemes";
import { Toaster } from "sonner";
import type { Project } from "@/types/chat";
import type { FileNode } from "../Editor/types/editor";
import { InputArea } from "../InputArea";
import { useProjects } from "@/hooks/useProjects";


export const Main = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [panel, setPanel] = useState<'chat' | 'code'>('chat');
    const { onCreateProject, onDeleteProject, projectsList, currentProject, setCurrentProject, messagesProject, isLoading, onSendMessage, isSending } = useProjects();
    const isMobile = useIsMobile();

    const [files, setFiles] = useState<FileNode[] | []>([]);
    const [selectedFile, setSelectedFile] = useState("1");
    const [tab, setTab] = useState("preview");

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handlePanelChange = () => {
        setPanel(prev => prev === 'chat' ? 'code' : 'chat');
    };

    return (
        <div className="min-h-dvh max-w-dvw min-w-dvw">
            {/* Sidebar toggle button */}
            <div className="absolute top-4 left-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>
            </div>
            {isMobile &&
                <Button variant="default" className="absolute top-4 right-16 z-10 border border-border h-10" onClick={handlePanelChange}>
                    {panel === 'code' ? <MessageCircleCodeIcon className="w-6 h-6"></MessageCircleCodeIcon> : <SquareCode className="w-6 h-6"></SquareCode>}
                </Button>
            }
            <SidebarApp
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                projects={projectsList}
                onChangeProject={setCurrentProject}
                onDeleteProject={onDeleteProject}></SidebarApp>
            {!currentProject && (
                <div className="flex flex-col justify-center h-screen w-full md:w-1/2 mx-auto">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-4xl font-bold">Creemos tu página!</h1>
                    </div>
                    <InputArea isSending={isSending} onCreateProject={onCreateProject}></InputArea>
                </div>
            )}
            {isLoading && <div className="flex flex-col justify-center h-screen w-full md:w-1/2 mx-auto">
                <div className="flex flex-col items-center justify-center gap-4">
                    <RefreshCw className="h-16 w-16 animate-spin" />
                </div>
            </div>}
            {currentProject && !isLoading &&
                <ResizablePanelGroup
                    onLayout={sizes => {
                        if (isMobile) {
                            return panel === 'chat' ? [100, 0] : [0, 100];
                        }
                        return sizes;
                    }}
                    direction="horizontal"
                    className="max-h-dvh h-dvh max-w-dvw w-dvw relative">
                    {/** Toggle Panel */}

                    {/* Chat */}

                    <ResizablePanel className="min-h-dvh max-h-dvh"
                        minSize={isMobile && panel === 'chat' ? 100 : 0}
                        maxSize={isMobile && panel === 'code' ? 0 : 100}
                        defaultSize={isMobile && panel === 'chat' ? 100 : 30}
                        collapsedSize={0}
                    >
                        <PanelChat
                            isSending={isSending}
                            viewCode={setTab}
                            messages={messagesProject || []}
                            files={files}
                            currentProject={currentProject}
                            onSendMessage={onSendMessage}
                            onFilesChange={(files) => {
                                setFiles(files);
                                setSelectedFile(files[0]?.id || "1");
                            }}></PanelChat>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-transparent" ></ResizableHandle>
                    <ResizablePanel className="max-h-dvh h-dvh max-w-dvw w-dvw relative">
                        <Tabs value={tab} className="flex flex-col h-full gap-0">
                            <TabsList className="m-0 p-0 h-16 min-h-16 bg-transparent pt-6">
                                <TabsTrigger value="preview" onClick={() => setTab('preview')} className="bg-transparent rounded-b-none px-4 data-[state=active]:border-border"><AppWindow></AppWindow> Preview</TabsTrigger>
                                <TabsTrigger value="code" onClick={() => setTab('code')} className="bg-transparent rounded-b-none px-4 data-[state=active]:border-border" ><SquareCode></SquareCode> Code</TabsTrigger>
                            </TabsList>
                            <TabsContent value="preview" className="p-0 m-0">
                                <div className="w-full p-2 border flex">
                                    <Button variant={"ghost"} className="">
                                        <RefreshCcw className="h-4 w-4"></RefreshCcw>
                                    </Button>
                                    <Input defaultValue={"/"} disabled></Input>
                                </div>
                                <Preview files={files} />
                            </TabsContent>
                            <TabsContent value="code" id="code-editor" className="p-0 m-0 ">
                                <CodeEditor
                                    themes={editorThemes}
                                    files={files}
                                    selectedFile={selectedFile}
                                    defaultTheme="xintheria-dark"
                                    onChangeSelectedFile={(id) => {
                                        setSelectedFile(id);
                                    }}
                                    onChangeFile={(file) => {
                                        setFiles((prev) => prev.map((f) => f.id === file.id ? file : f));
                                    }}
                                ></CodeEditor>
                            </TabsContent>
                        </Tabs>
                    </ResizablePanel>
                </ResizablePanelGroup>
            }
            <Toaster richColors expand position={isMobile ? "top-center" : "bottom-right"} closeButton visibleToasts={3} ></Toaster>
        </div >
    );
}
