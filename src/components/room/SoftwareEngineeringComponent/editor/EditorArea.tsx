"use client";

import React, { useEffect, useState, useRef } from "react";
import { js_beautify } from "js-beautify";

interface EditorAreaProps {
  initialContent: string;
  value: string;
  onChange: (newContent: string) => void;
  tabSize?: number; // Optional prop to set tab size, defaults to 4
}

export function EditorArea({
  initialContent,
  value,
  onChange,
  tabSize = 4, // Default tab size is 4
}: EditorAreaProps) {
  const [lineCount, setLineCount] = useState<number>(1); // Track line numbers
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea

  // Beautify initial content and set it only when the component mounts or initialContent changes
  useEffect(() => {
    const beautifyCode = (code: string) =>
      js_beautify(code, {
        indent_size: tabSize,
        space_in_empty_paren: true,
        brace_style: "collapse",
      });

    // Only set code if it's the initial load
    if (value === "") {
      onChange(beautifyCode(initialContent));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent, tabSize]);

  // Update line numbers dynamically
  useEffect(() => {
    setLineCount(value.split("\n").length);
  }, [value]);

  // Handle key events (Tab and Backspace support)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const TAB = "Tab";
    const BACKSPACE = "Backspace";

    if (e.key === TAB) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd, value: textareaValue } = textarea;

      // Define the tab string based on tabSize
      const tabString = " ".repeat(tabSize);

      if (!e.shiftKey) {
        // Insert spaces when Tab is pressed
        const beforeTab = textareaValue.substring(0, selectionStart);
        const afterTab = textareaValue.substring(selectionEnd);
        const newValue = beforeTab + tabString + afterTab;

        onChange(newValue);

        // Move cursor after the inserted tab
        requestAnimationFrame(() => {
          if (textarea) {
            const newCursorPosition = selectionStart + tabSize;
            textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
          }
        });
      } else {
        // Handle Shift+Tab for unindenting
        // Find the start of the current line
        const startLine = textareaValue.lastIndexOf("\n", selectionStart - 1) + 1;
        // Find the end of the current line
        const endLine = textareaValue.indexOf("\n", selectionStart);
        const end = endLine === -1 ? textareaValue.length : endLine;

        // Extract the current line(s)
        const selectedText = textareaValue.substring(startLine, end);
        const lines = selectedText.split("\n");

        // Unindent each line by removing up to tabSize spaces
        const unindentedLines = lines.map((line) => {
          if (line.startsWith(tabString)) {
            return line.substring(tabSize);
          }
          return line.replace(/^\s+/, ""); // Remove any leading whitespace if less than tabSize
        });

        const newSelectedText = unindentedLines.join("\n");
        const newValue =
          textareaValue.substring(0, startLine) +
          newSelectedText +
          textareaValue.substring(end);

        onChange(newValue);

        // Adjust cursor position
        requestAnimationFrame(() => {
          if (textarea) {
            const newCursorPosition = selectionStart - tabSize;
            textarea.selectionStart = textarea.selectionEnd = Math.max(newCursorPosition, startLine);
          }
        });
      }
    } else if (e.key === BACKSPACE) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd, value: textareaValue } = textarea;

      // Only handle backspace when there is no text selection
      if (selectionStart === selectionEnd) {
        // Define the tab string based on tabSize
        const tabString = " ".repeat(tabSize);

        // Get the text before the cursor
        const beforeCursor = textareaValue.substring(0, selectionStart);

        // Check if the text before the cursor ends with the tab string
        if (beforeCursor.endsWith(tabString)) {
          e.preventDefault(); // Prevent the default backspace behavior

          const newValue =
            textareaValue.substring(0, selectionStart - tabSize) +
            textareaValue.substring(selectionEnd);

          onChange(newValue);

          // Move cursor back by tabSize
          requestAnimationFrame(() => {
            if (textarea) {
              const newCursorPosition = selectionStart - tabSize;
              textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
            }
          });
        }
      }
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] overflow-hidden">
      {/* Line Numbers */}
      <div className="text-gray-500 text-sm font-mono p-4 select-none">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="leading-5">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code Editor */}
      <div className="flex-1 p-1 overflow-auto">
        <textarea
          ref={textareaRef} // Attach the ref to the textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full text-gray-300 font-mono text-sm bg-[#1e1e1e] border-none focus:outline-none"
          style={{
            whiteSpace: "pre",
            lineHeight: "1.5",
            overflow: "auto",
          }}
        />
      </div>
    </div>
  );
}
