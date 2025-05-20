export interface Project {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images_url: string;
  project_id: string;
}
