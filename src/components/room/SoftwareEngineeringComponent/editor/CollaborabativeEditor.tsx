"use client";

import { useState, useCallback, useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { Judge0Data, getSubmissionResult, submitCode } from "@/services/judge0Service";
import { EditorArea } from "./EditorArea";

export const LANGUAGES = [
  { name: "C++ 17", id: 54, value: "cpp17" },
  { name: "Python 3", id: 71, value: "python3" },
  { name: "Java", id: 62, value: "java" },
  { name: "JavaScript", id: 63, value: "javascript" },
  { name: "C#", id: 51, value: "csharp" }
];

export interface Language {
  name: string;
  id: number;
  value: string;
}

export interface SubmissionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status: {
    id: number;
    description: string;
  };
}

const DEFAULT_CODE_BY_LANGUAGE: Record<string, string> = {
  cpp17: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
  python3: `print("Hello, World!")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  javascript: `console.log("Hello, World!");`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
};

interface CollaborativeEditorProps {
  setOutput: (output: string) => void;
}

export function CollaborativeEditor({ setOutput }: CollaborativeEditorProps) {
  const [code, setCode] = useState<string>(DEFAULT_CODE_BY_LANGUAGE.cpp17);
  const [language, setLanguage] = useState<string>("cpp17");
  const [resetKey, setResetKey] = useState<number>(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  const selectedLanguage: Language =
    LANGUAGES.find((lang) => lang.value === language) || LANGUAGES[0];

  useEffect(() => {
    setCode(DEFAULT_CODE_BY_LANGUAGE[language]);
  }, [language]);

  const parseCompileErrors = (compileOutput: string) => {
    const errorLines = compileOutput.split('\n');
    const parsedErrors = errorLines.map((line) => {
      const match = line.match(/(\d+):(\d+): error: (.*)/); 
      if (match) {
        const lineNumber = match[1];
        const columnNumber = match[2];
        const errorMessage = match[3];
        return `Line ${lineNumber}, Col ${columnNumber}: ${errorMessage}`;
      } else if (line.toLowerCase().includes('error')) {
        return `Error: ${line.trim()}`;
      }
      return null;
    }).filter(Boolean);
  
    return parsedErrors.length > 0 ? parsedErrors.join('\n') : "No compile errors found";
  };

  const handleRunCode = useCallback(async () => {
    setOutput("Running...");
    try {
      const token = await submitCode(code, selectedLanguage.id);
      const result = await pollSubmissionResult(token);

      if(result.status.id === 6 ){
        setOutput(parseCompileErrors(result.compile_output!)); 
      }else if(result.status.id === 3){
        setOutput(result.stdout!);
      }else if (result.status.id === 11) {
        setOutput(`Runtime Error: \n${result.stderr}`);
      } else {
        setOutput("No Output");
      }
    } catch (error) {
      handleApiError(error);
    }
  }, [code, selectedLanguage.id, setOutput]);

  const pollSubmissionResult = async (
    token: string,
    retries: number = 10,
    interval: number = 2000
  ): Promise<Judge0Data> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result : Judge0Data= await getSubmissionResult(token);
        if (result.status.id === 3 || result.status.id === 6 || result.status.id === 11) { 
          return result;
        }
      } catch (pollError) {
        console.error("Polling error:", pollError);
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error("Submission timed out.");
  };

  const handleApiError = (error: any) => {
    if (error.response) {
      const { status, data } = error.response;
      setOutput(`Error ${status}: ${data?.message || 'An unexpected error occurred'}`);
    } else if (error.message) {
      setOutput(`Error: ${error.message}`);
    } else {
      setOutput("An unknown error occurred.");
    }
  };

  const handleRequestReset = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmReset = () => {
    setCode(DEFAULT_CODE_BY_LANGUAGE[language]);
    setResetKey((prev) => prev + 1);
    setOutput("");
    setIsConfirmDialogOpen(false);
  };

  const handleCancelReset = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        language={language}
        setLanguage={setLanguage}
        onRunCode={handleRunCode}
        onRequestReset={handleRequestReset}
        languages={LANGUAGES}
      />

      <EditorArea
        key={resetKey}
        initialContent={DEFAULT_CODE_BY_LANGUAGE.cpp17}
        value={code}
        onChange={setCode}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        title="Confirm Reset"
        message="Are you sure you want to reset? All changes will be lost."
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  );
}
