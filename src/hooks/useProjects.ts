import type { ChatFormSchema } from '@/components/chatform';
import type { FileNode } from '@/components/Editor/types/editor';
import type { Message, Project } from '@/types/chat';
import { useEffect, useState } from 'react';

interface UseProjects {
  currentProject: Project | null;
  onCreateProject?: (project: ChatFormSchema) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  files?: FileNode[];
  onFilesChange?: (files: FileNode[]) => void;
  projectsList?: Project[];
  onSendMessage?: (message: ChatFormSchema) => Promise<void>;
  isSending: boolean;
  onProjectsListChange?: (projects: Project[]) => void;
  onDeleteProject?: (projectId: string) => Promise<void>;
  messagesProject?: Message[] | null;
  error?: string | null;
  isLoading?: boolean;
}

export const useProjects = (): UseProjects => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [messagesProject, setMessagesProject] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = '/api/projects';

  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        return;
      }

      const { data, error } = await res.json();
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setProjectsList(data);
      }
    };
    getProjects();
  }, []);

  useEffect(() => {
    if (currentProject) {
      setIsLoading(true);
      const getProject = async () => {
        const res = await fetch(`${BASE_URL}/${currentProject.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          return;
        }
        const { data, error } = await res.json();
        if (error) {
          setError(error);
          return;
        }
        if (data) {
          setMessagesProject(data);
          setIsLoading(false);
        }
      };
      getProject();
    }
  }, [currentProject]);

  const onCreateProject = async (chatForm: ChatFormSchema) => {
    const formData = new FormData();
    formData.append('attachFile', chatForm.attachFile as Blob);
    formData.append('model', chatForm.model);
    formData.append('currentProjectId', chatForm.currentProjectId as string);
    formData.append('messages', JSON.stringify(chatForm.messages));
    formData.append('html', chatForm.html as string);
    formData.append('css', chatForm.css as string);
    formData.append('js', chatForm.js as string);
    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      setError('Failed to create project');
      return;
    }
    const { data, error } = await res.json();
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setCurrentProject(data);
      setProjectsList(prev => [...prev, data]);
    }
  };

  const onDeleteProject = async (projectId: string) => {
    const res = await fetch(`${BASE_URL}/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      setError('Failed to delete project');
      return;
    }
    const { error } = await res.json();
    if (error) {
      setError(error.message);
      return;
    }
    setProjectsList(prev => prev.filter(project => project.id !== projectId));
    setCurrentProject(prev => (prev?.id === projectId ? null : prev));
  };

  const onSendMessage = async (message: ChatFormSchema) => {
    if (!currentProject) return;
    setIsSending(true);
    const res = await fetch(`${BASE_URL}/${currentProject.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      setError('Failed to send message');
      setIsSending(false);
      return;
    }
    const { data, error } = await res.json();
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
    if (data) {
      setMessagesProject(prev =>
        prev
          ? [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'user',
                text: message.messages?.[0]?.content ?? '',
                project_id: message.currentProjectId,
              },
              data[0],
            ]
          : [data[0]]
      );
      setIsSending(false);
    }
  };
  return {
    currentProject,
    setCurrentProject,
    onCreateProject,
    projectsList,
    onProjectsListChange: setProjectsList,
    onDeleteProject,
    messagesProject,
    isLoading,
    error,
    onSendMessage,
    isSending,
  };
};
