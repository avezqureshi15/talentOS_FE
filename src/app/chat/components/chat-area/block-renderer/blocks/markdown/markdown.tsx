import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";
import "./markdown.css";

type Props = {
  content: string;
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const memoContent = useMemo(() => content, [content]);

  return (
    <div className="md-root">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 🧠 Paragraph
          p: ({ children }) => <p className="md-p">{children}</p>,

          // 🧠 Headings
          h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="md-h3">{children}</h3>,

          // 🧠 Links (safe + styled)
          a: ({ href, children }) => (
            <a
              className="md-link"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),

          // 🧠 Lists
          ul: ({ children }) => <ul className="md-ul">{children}</ul>,
          ol: ({ children }) => <ol className="md-ol">{children}</ol>,
          li: ({ children }) => <li className="md-li">{children}</li>,

          // 🧠 Blockquote
          blockquote: ({ children }) => (
            <blockquote className="md-quote">{children}</blockquote>
          ),

          // 🧠 Tables (BIG UX upgrade)
          table: ({ children }) => (
            <div className="md-table-wrap">
              <table className="md-table">{children}</table>
            </div>
          ),

          th: ({ children }) => <th className="md-th">{children}</th>,
          td: ({ children }) => <td className="md-td">{children}</td>,

          // 🧠 Code blocks (IMPORTANT)
          code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
            if (inline) {
              return <code className="md-inline-code">{children}</code>;
            }

            return (
              <div className="md-code-wrapper">
                <pre className="md-pre">
                  <code className={className}>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {memoContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;