interface EditorTokenRule {
  token: string;
  foreground: string;
  fontStyle?: string;
}

interface EditorThemeColors {
  [colorId: string]: string;
}

interface EditorTheme {
  base: string;
  inherit: boolean;
  rules: EditorTokenRule[];
  colors: EditorThemeColors;
}

export interface EditorThemes {
  [themeName: string]: EditorTheme;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  value?: string;
  children?: FileNode[];
}
