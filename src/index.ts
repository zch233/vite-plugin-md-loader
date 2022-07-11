import type { Plugin } from 'vite';
import { readFileSync } from 'fs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import mdContainer from 'markdown-it-container';

export default function (options = {}): Plugin {
    const { defaultImport } = options as any;
    const mdRegex = /\.md(\?(raw|component))?$/;
    return {
        name: 'vite-plugin-md-loader',
        enforce: 'pre',
        async load(id) {
            const [path, query] = id.split('?', 2);
            if (!id.match(mdRegex)) {
                return;
            }
            const importType = query || defaultImport;

            if (importType === 'url') {
                return; // Use default md loader
            }
            let MDString: string;
            try {
                MDString = readFileSync(path, 'utf-8');
            } catch (ex) {
                console.warn("File couldn't be loaded, fallback to default loader", ex);
                return; // File couldn't be loaded, fallback to default loader
            }
            if (importType === 'raw') {
                return `export default ${JSON.stringify(MDString)}`;
            }
            const markdownHTML = new MarkdownIt({
                highlight: function (str: string, lang: string) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return getHighlightCode(str, lang);
                        } catch (_) {}
                    }
                    return ''; // use external default escaping
                },
            })
                .use(mdContainer)
                .render(MDString);
            return `export default ${JSON.stringify(markdownHTML)}`;
        },
    };
}

export const getHighlightCode = (code: string, lang: string) => hljs.highlight(code, { language: lang || 'jsx' }).value;
