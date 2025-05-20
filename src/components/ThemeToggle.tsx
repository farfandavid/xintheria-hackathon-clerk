import { useStore } from "@nanostores/react";
import { theme, toggleTheme } from "@/stores/themeStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const current = useStore(theme);

    return (
        <Button onClick={toggleTheme} variant="ghost" className="w-10 h-10 p-0 rounded-full border border-border absolute top-4 right-4 z-10">
            {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    );
}
