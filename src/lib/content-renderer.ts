/**
 * Server-compatible content rendering utilities
 * This file can be used in both client and server components
 */

/**
 * Checks if content is HTML
 */
export const isHTML = (content: string): boolean => {
  return /<[^>]*>/g.test(content);
};

/**
 * Converts markdown to HTML - server compatible
 */
export const renderContentToHTML = (content: string): string => {
  if (!content) return "";

  // If already HTML, return as is
  if (isHTML(content)) return content;

  // Convert markdown to HTML
  // Convert headers
  let html = content
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>");

  // Convert bold and italic
  html = html
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

  // Convert bullet points - improved to handle more formats
  html = html.replace(/^\s*[-•*] (.*$)/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Convert numbered lists
  html = html.replace(/^\s*\d+\. (.*$)/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert paragraphs - improved to handle content better
  html = html.replace(/^(?!<[uo]l|<li|<h[1-6])(.*$)/gm, "<p>$1</p>");

  return html;
};
