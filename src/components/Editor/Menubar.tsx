import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "../ui/menubar";
import type { EditorThemes } from "./types/editor";
import { editorThemes } from "./utils/editorThemes";

interface MenubarProps {
    themes?: EditorThemes;
    onChangeTheme?: (theme: string) => void;
    onDownload?: () => void;
}

export function MenubarEditor({ themes, onChangeTheme, onDownload }: MenubarProps) {

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        }
    }
    const handleThemeChange = (theme: string) => {
        if (onChangeTheme) {
            onChangeTheme(theme);
        }
    }
    return (
        <Menubar className="rounded-none">
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={() => handleDownload()}>Download</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Preferences</MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger>Themes</MenubarSubTrigger>
                        <MenubarSubContent>
                            {themes && Object.keys(themes).map((theme) => (
                                <MenubarItem key={theme} onClick={() => handleThemeChange(theme)}>
                                    {theme.replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                </MenubarItem>
                            ))}
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}