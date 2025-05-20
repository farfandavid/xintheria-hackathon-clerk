import { exampleFiles } from "@/lib/example";
import { useEffect, useRef, useState } from "react";
import type { FileNode } from "./Editor/types/editor";

export default function Preview({ files = exampleFiles }: { files?: FileNode[] }) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [srcHtml, setSrcHtml] = useState<string | null>(null);

    useEffect(() => {
        if (!iframeRef.current || files.length === 0) return;
        const rawHtml = files.find(f => f.language === "html")?.value || "";
        const rawCss = files.find(f => f.language === "css")?.value || "";
        const rawJs = files.find(f => f.language === "javascript")?.value || "";
        const cssBlob = new Blob([rawCss], { type: 'text/css' });
        const jsBlob = new Blob([rawJs], { type: 'text/javascript' });

        const cssUrl = URL.createObjectURL(cssBlob);
        const jsUrl = URL.createObjectURL(jsBlob);

        let html = rawHtml;
        html = html.replace(
            /<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>/i,
            `<link rel="stylesheet" href="${cssUrl}" />`
        );
        html = html.replace(
            /<script\s+src=["']script\.js["']\s*>\s*<\/script>/i,
            `<script type="module">
            ${rawJs}
            </script>`
        );
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(htmlBlob);

        iframeRef.current.src = htmlUrl;
        return () => {
            URL.revokeObjectURL(cssUrl);
            URL.revokeObjectURL(jsUrl);
            URL.revokeObjectURL(htmlUrl);
        };
    }, [files]);

    return (
        <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border bg-white"
        />
    );
}