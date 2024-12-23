/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface QuestionModel {
  questionTitle: string;
  questionS3Url: string;
  // Add other properties if needed
}

interface QuestionSectionProps {
  question: QuestionModel;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ question }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!question || !question.questionS3Url) {
      setError('Invalid question data.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMarkdown = async () => {
      try {
        const response = await fetch(question.questionS3Url, { signal });

        if (!response.ok) {
          throw new Error(`Error fetching markdown: ${response.statusText}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();

    // Cleanup function to abort fetch on unmount
    return () => {
      controller.abort();
    };
  }, [question, question.questionS3Url]);

  if (loading) {
    return <p>Loading question...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize markdown elements if needed
          h1: ({  ...props }) => <h1 style={{ color: '#333' }} {...props} />,
          h2: ({  ...props }) => <h2 style={{ color: '#444' }} {...props} />,
          a: ({  ...props }) => (
            <a
              style={{ color: '#007bff' }}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Add more custom renderers as needed
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default QuestionSection;
