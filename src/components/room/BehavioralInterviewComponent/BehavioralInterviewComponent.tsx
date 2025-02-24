import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import VideoCall from "@/components/room/VideoCall/VideoCall";
import { GetRoomPayloadResponse } from "@/models/room/GetRoomPayloadResponse";

interface BehavioralEngineeringComponentProps {
  roomId: string;
  roomPayload: GetRoomPayloadResponse;
  isInterviewerRole: boolean;
  handleEndCall: () => void;
}

const BehavioralInterviewComponent: React.FC<BehavioralEngineeringComponentProps> = ({
  roomId,
  roomPayload,
  isInterviewerRole,
  handleEndCall,
}) => {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(350); // initial width for interviewer
  const [draggingDivider, setDraggingDivider] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  // Extract S3 URL, tags, and companies
  const questionS3Url = roomPayload?.peerInfo?.question?.questionS3Url;
  const tags = roomPayload?.peerInfo?.question?.tags || [];
  const companies = roomPayload?.peerInfo?.question?.companies || [];
  

  // Fetch Markdown content from S3 URL
  useEffect(() => {
    const fetchMarkdown = async () => {
      if (questionS3Url) {
        try {
          const response = await fetch(questionS3Url);
          if (!response.ok) {
            throw new Error("Failed to fetch Markdown file");
          }
          const text = await response.text();
          setMarkdownContent(text);
        } catch (error) {
          console.error("Error fetching Markdown:", error);
          setMarkdownContent("Error loading question.");
        }
      }
    };

    fetchMarkdown();
  }, [questionS3Url]);

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingDivider(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setDraggingDivider(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 flex overflow-hidden">
      {isInterviewerRole && (
        <div
          className="bg-white p-6 shadow-md flex flex-col overflow-auto border-r border-gray-300"
          style={{ width: `${sidebarWidth}px` }}
        >
          <h1 className="text-lg font-bold mb-4">Question you will ask to your peer:</h1>
          
          {/* Tags Section */}
          {tags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Companies Section */}
          {companies.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Companies Asked</h3>
              <div className="flex flex-wrap gap-2">
                {companies.map((company, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {company.companyName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Render Markdown content if fetched */}
          {markdownContent && (
            <div className="prose max-w-none">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {isInterviewerRole && (
        <div
          className="w-2 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition"
          onMouseDown={handleDividerMouseDown}
          style={{ cursor: draggingDivider ? "ew-resize" : "col-resize" }}
        ></div>
      )}

      <div
        className="flex-1 flex justify-center items-center relative bg-gray-900"
        style={{ width: isInterviewerRole ? `calc(100% - ${sidebarWidth}px)` : "100%" }}
      >
        <div
          ref={videoCallRef}
          className="absolute z-10 w-full h-full bg-gray-800 shadow-md border rounded-md"
        >
          <VideoCall
            roomId={roomId}
            userName={roomPayload?.userDetails?.userName || "Guest"}
            userID={roomPayload.userDetails?.userID.toString()}
            interviewTypeModel={roomPayload?.roomDetails.interviewType}
            isInterviewerRole={isInterviewerRole}
            onEndCall={handleEndCall}
          />
        </div>
      </div>
    </div>
  );
};

export default BehavioralInterviewComponent;
