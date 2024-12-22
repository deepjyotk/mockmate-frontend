'use client';

interface OutputSectionProps {
  output?: string; // Optional prop for output text
}

export function OutputSection({ output }: OutputSectionProps) {
  return (
    <div className="p-4 bg-black border-t border-gray-700 text-gray-300 text-sm h-full">
      <span className="font-semibold">Output:</span>
      <pre className="mt-2 bg-gray-800 p-2 rounded break-words whitespace-pre-wrap h-full overflow-y-auto">
        {output || "Run the code to see output here..."}
      </pre>
    </div>
  );
}
