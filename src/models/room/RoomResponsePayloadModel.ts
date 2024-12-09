export interface RoomResponsePayloadModel {
  roomIdHash: string;      // Unique identifier for the room
  kitToken: string;    // Token related to the kit (if applicable)
  peerId: number;      // Identifier for the peer
  peerName: string;    // Name of the peer
  status: string;      // Status of the room/peer
  message: string;     // Message related to the room response
}
