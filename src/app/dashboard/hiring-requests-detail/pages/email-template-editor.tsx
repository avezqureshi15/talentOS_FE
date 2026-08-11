import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  RemoveFormatting,
} from "lucide-react";

type EmailTemplateEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const TOKEN_RE = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

const BASE_BLOCK_STYLE =
  "font-size:14px;line-height:1.7;color:rgba(255,255,255,0.6);margin:0 0 16px;";
const BASE_LIST_STYLE = "margin:0 0 16px;padding-left:20px;";
const BASE_ITEM_STYLE = "margin:2px 0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.6);";

const FORBIDDEN = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "title",
  "img",
  "table",
  "video",
  "audio",
];

function hydrate(content: string): string {
  const doc = new DOMParser().parseFromString(content, "text/html");
  const textNodes: Text[] = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  for (const node of textNodes) {
    const text = node.nodeValue || "";
    if (!TOKEN_RE.test(text)) continue;
    TOKEN_RE.lastIndex = 0;
    const fragment = doc.createDocumentFragment();
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = TOKEN_RE.exec(text)) !== null) {
      if (match.index > last) {
        fragment.appendChild(doc.createTextNode(text.slice(last, match.index)));
      }
      const chip = doc.createElement("span");
      chip.className = "em-token";
      chip.setAttribute("contenteditable", "false");
      chip.setAttribute("data-token", match[1]);
      chip.textContent = match[1];
      fragment.appendChild(chip);
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      fragment.appendChild(doc.createTextNode(text.slice(last)));
    }
    node.parentNode?.replaceChild(fragment, node);
  }
  return doc.body.innerHTML;
}

function serialize(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;

  clone.querySelectorAll(".em-token").forEach((chip) => {
    const key = chip.getAttribute("data-token") || "";
    chip.replaceWith(document.createTextNode(`{{${key}}}`));
  });

  FORBIDDEN.forEach((tag) => {
    clone.querySelectorAll(tag).forEach((el) => el.remove());
  });

  clone.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || (name === "href" && /^\s*javascript:/i.test(attr.value))) {
        el.removeAttribute(attr.name);
      }
    });
  });

  clone.querySelectorAll("div").forEach((el) => {
    const p = document.createElement("p");
    p.innerHTML = el.innerHTML;
    p.setAttribute("style", BASE_BLOCK_STYLE);
    el.replaceWith(p);
  });

  clone.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "p") {
      el.setAttribute("style", BASE_BLOCK_STYLE);
    } else {
      const size = { h1: "22px", h2: "18px", h3: "16px" }[tag] || "15px";
      el.setAttribute(
        "style",
        `font-size:${size};font-weight:700;line-height:1.4;color:rgba(255,255,255,0.92);margin:0 0 12px;`,
      );
    }
  });

  clone.querySelectorAll("ul, ol").forEach((el) => el.setAttribute("style", BASE_LIST_STYLE));
  clone.querySelectorAll("li").forEach((el) => el.setAttribute("style", BASE_ITEM_STYLE));

  return clone.innerHTML.trim();
}

function editorRootFromSelection(): HTMLElement | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const node = sel.getRangeAt(0).commonAncestorContainer;
  const el = node instanceof HTMLElement ? node : node.parentElement;
  return el?.closest(".em-editor-area") ?? null;
}

export default function EmailTemplateEditor({
  value,
  onChange,
  disabled = false,
}: EmailTemplateEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = hydrate(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (serialize(el) === value) return;
    el.innerHTML = hydrate(value);
  }, [value]);

  const emitFrom = (root: HTMLElement) => {
    onChange(serialize(root));
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    emitFrom(e.currentTarget);
  };

  const handleCommand = (command: string, commandValue?: string) => {
    if (disabled) return;
    document.execCommand(command, false, commandValue);
    const root = editorRootFromSelection();
    if (root) emitFrom(root);
  };

  const addLink = () => {
    if (disabled) return;
    const url = window.prompt("Link URL", "https://");
    if (url) {
      handleCommand("createLink", url);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    const root = editorRootFromSelection();
    if (root) emitFrom(root);
  };

  const toolButton = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      className="em-editor-btn"
      title={label}
      aria-label={label}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div className={`em-editor${disabled ? " em-editor--disabled" : ""}`}>
      <div className="em-editor-toolbar">
        {toolButton("Bold", <Bold size={15} />, () => handleCommand("bold"), "bold")}
        {toolButton("Italic", <Italic size={15} />, () => handleCommand("italic"), "italic")}
        {toolButton("Underline", <Underline size={15} />, () => handleCommand("underline"), "underline")}
        <span className="em-editor-divider" />
        {toolButton("Bulleted list", <List size={15} />, () => handleCommand("insertUnorderedList"), "ul")}
        {toolButton("Numbered list", <ListOrdered size={15} />, () => handleCommand("insertOrderedList"), "ol")}
        {toolButton("Add link", <Link2 size={15} />, addLink, "link")}
        {toolButton("Clear formatting", <RemoveFormatting size={15} />, () => handleCommand("removeFormat"), "clear")}
      </div>
      <div
        ref={editorRef}
        className="em-editor-area"
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder="Write your message here…"
        onInput={handleInput}
        onPaste={handlePaste}
      />
    </div>
  );
}
