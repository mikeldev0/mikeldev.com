const INLINE_MARKDOWN =
  /(\*\*[^*\n]+\*\*|__[^_\n]+__|`[^`\n]+`|\[[^\]\n]+\]\(https?:\/\/[^)\s]+\)|\*[^*\n]+\*|_[^_\n]+_)/g;

function appendInlineMarkdown(parent: ParentNode, text: string): void {
  let cursor = 0;

  for (const match of text.matchAll(INLINE_MARKDOWN)) {
    const token = match[0];
    const start = match.index ?? cursor;

    if (start > cursor) parent.append(document.createTextNode(text.slice(cursor, start)));

    if (token.startsWith("**") || token.startsWith("__")) {
      const strong = document.createElement("strong");
      strong.textContent = token.slice(2, -2);
      parent.append(strong);
    } else if (token.startsWith("`")) {
      const code = document.createElement("code");
      code.className = "chat-markdown-code";
      code.textContent = token.slice(1, -1);
      parent.append(code);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);

      if (linkMatch) {
        const link = document.createElement("a");
        link.className = "chat-markdown-link";
        link.href = linkMatch[2];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = linkMatch[1];
        parent.append(link);
      } else {
        parent.append(document.createTextNode(token));
      }
    } else {
      const emphasis = document.createElement("em");
      emphasis.textContent = token.slice(1, -1);
      parent.append(emphasis);
    }

    cursor = start + token.length;
  }

  if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
}

function appendParagraph(parent: ParentNode, lines: string[]): void {
  const paragraph = document.createElement("p");
  paragraph.className = "chat-markdown-paragraph";

  lines.forEach((line, index) => {
    if (index > 0) paragraph.append(document.createElement("br"));
    appendInlineMarkdown(paragraph, line);
  });

  parent.append(paragraph);
}

function appendList(parent: ParentNode, lines: string[], ordered: boolean): void {
  const list = document.createElement(ordered ? "ol" : "ul");
  list.className = `chat-markdown-list ${ordered ? "chat-markdown-list--ordered" : ""}`.trim();

  lines.forEach((line) => {
    const item = document.createElement("li");
    appendInlineMarkdown(item, line.replace(/^(?:[-*]|\d+\.)\s+/, ""));
    list.append(item);
  });

  parent.append(list);
}

export function renderSimpleMarkdown(container: HTMLElement, markdown: string): void {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const content = document.createDocumentFragment();
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }

    const heading = lines[index].match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const title = document.createElement(`h${heading[1].length}`);
      title.className = "chat-markdown-heading";
      appendInlineMarkdown(title, heading[2]);
      content.append(title);
      index += 1;
      continue;
    }

    if (/^(?:[-*]|\d+\.)\s+/.test(lines[index])) {
      const ordered = /^\d+\.\s+/.test(lines[index]);
      const listLines: string[] = [];

      while (
        index < lines.length &&
        new RegExp(ordered ? "^\\d+\\.\\s+" : "^[-*]\\s+").test(lines[index])
      ) {
        listLines.push(lines[index]);
        index += 1;
      }

      appendList(content, listLines, ordered);
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3})\s+/.test(lines[index]) &&
      !/^(?:[-*]|\d+\.)\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    appendParagraph(content, paragraphLines);
  }

  container.replaceChildren(content);
}
