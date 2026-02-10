import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

/**
 * Custom Rich Text Display Component
 * Supports all HTML formatting from Quill or any rich text editor:
 * - Bold, Italic, Underline
 * - Headings (h1, h2, h3, etc.)
 * - Unordered lists (ul) with disc bullets
 * - Ordered lists (ol) with numbers
 * - Nested lists
 * - Links
 * - Images
 * - Blockquotes
 */
export default function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  return (
    <div
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: content.replaceAll('&nbsp;', ' ') }}
    />
  );
}
