import WebSocket, { WebSocketServer } from "ws";
import net from "net";

const PORT = process.env.PORT || 8080;
const MC_SERVER = process.env.MINECRAFT_SERVER_IP || "nibulus.minekeep.gg";
const MC_PORT = parseInt(process.env.MINECRAFT_SERVER_PORT || "25565");

const wss = new WebSocketServer({ port: PORT });

console.log(`[Eaglercraft Proxy] Listening on port ${PORT}`);
console.log(`[Eaglercraft Proxy] Forwarding traffic to ${MC_SERVER}:${MC_PORT}`);

wss.on("connection", (ws) => {
  const mc = net.connect(MC_PORT, MC_SERVER, () => {
    console.log("[Eaglercraft Proxy] Player connected");
  });

  mc.on("data", (data) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });

  ws.on("message", (msg) => mc.write(msg));
  ws.on("close", () => mc.destroy());
  mc.on("close", () => ws.close());
});
