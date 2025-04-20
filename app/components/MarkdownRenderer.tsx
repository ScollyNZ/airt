'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="markdown-body max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}