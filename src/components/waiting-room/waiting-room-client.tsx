"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosPostRequest } from "@/services/axiosService";
import { RoomResponsePayloadModel } from "@/models/room/RoomResponsePayloadModel";

interface WaitingRoomClientProps {
  interviewId: string;
}

const WaitingRoomClient: React.FC<WaitingRoomClientProps> = ({
  interviewId,
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    let isPolling = true;

    const pollForPeer = async () => {
      while (isPolling) {
        const response = await axiosPostRequest(
          `/room/join-waiting-room?interviewId=${interviewId}`,
          {}
        );

        if ("error" in response) {
          // const errorData = ;
          // handlePollingError(response.details.exceptionType);
          const exceptionType = response.details.exceptionType;

          if (
            [
              "WaitingForPeerException",
              "NoPeerMatchedYetException",
              "PeerWaitingThresholdReachedException",
            ].includes(exceptionType)
          ) {
            console.log("Still waiting for peer...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } else {
            setErrorMessage(
              `Sorry, we couldn't find a matching peer for you. Please try again later.`
            );
            isPolling = false;
            return;
            //TODO: "Sorry Couldn't be matched! something went wrong!".
          }
        } else {
          const data: RoomResponsePayloadModel =
            response.payload as RoomResponsePayloadModel;

          
            router.push(`/room/${data.roomIdHash}/${interviewId}`);
            isPolling = false;
            return;
          
        }
      }
    };

    pollForPeer();

    return () => {
      isPolling = false;
    };
  }, [interviewId, router, backendBaseUrl]);

  if (errorMessage) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-lg text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Waiting Room</h1>
      <p className="text-lg mb-8">
        Waiting for your peer to join the interview...
      </p>
      <div className="w-16 h-16 border-4 border-white border-t-yellow-300 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm">
        Hang tight! Your peer will be here shortly.
      </p>
    </div>
  );
};

export default WaitingRoomClient;
