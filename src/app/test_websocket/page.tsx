import WebSocketClient from "@/components/test_websocket/ClientComponent";

// server-component.tsx (Server Component)
export default function HomePage() {
  return (
    <div>
      <h1>WebSocket Example</h1>
      <WebSocketClient />
    </div>
  );
}
