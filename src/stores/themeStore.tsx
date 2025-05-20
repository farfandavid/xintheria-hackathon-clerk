import { atom } from 'nanostores';

export const theme = atom<"light" | "dark">("light");

export function initTheme() {
    const apply = (t: "light" | "dark") => {
        theme.set(t);
        document.documentElement.classList.toggle("dark", t === "dark");
    };

    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
        apply(stored);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        apply(prefersDark ? "dark" : "light");
    }

    window.addEventListener("storage", (e) => {
        if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
            apply(e.newValue);
        }
    });
}

export function toggleTheme() {
    const newTheme = theme.get() === "dark" ? "light" : "dark";
    theme.set(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
}
