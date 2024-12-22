'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProblemStatement } from '@/components/room/SoftwareEngineeringComponent/editor/ProblemStatement';
import { OutputSection } from '@/components/room/SoftwareEngineeringComponent/editor/OutputSection';
import { CollaborativeEditor } from '@/components/room/SoftwareEngineeringComponent/editor/CollaborabativeEditor';
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@liveblocks/react';

export default function EditorMain() {
  const [output, setOutput] = useState<string>('');

  /**
   * Manage the dimension states:
   * - leftWidth: for the left panel (Problem Statement)
   * - bottomHeight: for the bottom panel (Output Section)
   */
  const [leftWidth, setLeftWidth] = useState<number>(300); // initial width (px) of the left panel
  const [bottomHeight, setBottomHeight] = useState<number>(200); // initial height (px) of the bottom panel

  // References to track whether we are currently dragging & initial positions
  const isDraggingVertical = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startLeftWidthRef = useRef<number>(leftWidth);

  const isDraggingHorizontal = useRef<boolean>(false);
  const startYRef = useRef<number>(0);
  const startBottomHeightRef = useRef<number>(bottomHeight);

  /**
   * onMouseDown for the vertical divider
   */
  const onMouseDownVertical = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDraggingVertical.current = true;
      startXRef.current = e.clientX;
      startLeftWidthRef.current = leftWidth;
    },
    [leftWidth]
  );

  /**
   * onMouseDown for the horizontal divider
   */
  const onMouseDownHorizontal = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDraggingHorizontal.current = true;
      startYRef.current = e.clientY;
      startBottomHeightRef.current = bottomHeight;
    },
    [bottomHeight]
  );

  /**
   * Listen globally for mousemove/mouseup to perform the resizing
   */
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Vertical drag (changing left panel width)
      if (isDraggingVertical.current) {
        const delta = e.clientX - startXRef.current;
        setLeftWidth(startLeftWidthRef.current + delta);
      }

      // Horizontal drag (changing bottom panel height)
      if (isDraggingHorizontal.current) {
        const delta = startYRef.current - e.clientY;
        setBottomHeight(startBottomHeightRef.current + delta);
      }
    }

    function handleMouseUp() {
      // Stop dragging
      isDraggingVertical.current = false;
      isDraggingHorizontal.current = false;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-300 flex">
      
      {/* <div
        className="bg-gray-800 border-r border-gray-700 overflow-auto"
        style={{ width: `${leftWidth}px` }}
      >
        <ProblemStatement />
      </div>
      <div
        className="w-1 bg-gray-700 cursor-col-resize hover:bg-gray-600"
        onMouseDown={onMouseDownVertical}
      /> */}

      {/* Right side (Editor + Horizontal divider + Output) */}
      <div className="flex-1 flex flex-col">
        {/* Editor (top section) */}
        <div className="flex-1 bg-gray-800 border-b border-gray-700 overflow-y-auto relative">
          <LiveblocksProvider publicApiKey="pk_dev_rxkSsxA7iETuheL95_Dy6STPeGPMTxUMJfYtCmpSOOejcDzGnRd4J_Rt9ExsGgES">
            <RoomProvider id="my-room">
              <ClientSideSuspense
                fallback={<div className="text-gray-400">Loading…</div>}
              >
                <CollaborativeEditor setOutput={setOutput} />
              </ClientSideSuspense>
            </RoomProvider>
          </LiveblocksProvider>
        </div>

        {/* Horizontal divider (draggable handle) */}
        <div
          className="h-2 bg-gray-700 cursor-row-resize hover:bg-gray-600"
          onMouseDown={onMouseDownHorizontal}
        />

        {/* Output (bottom section) */}
        <div
          className="bg-gray-800 flex-shrink-0"
          style={{ height: `${bottomHeight}px` }}
        >
          <OutputSection output={output} />
        </div>
      </div>
    </div>
  );
}
