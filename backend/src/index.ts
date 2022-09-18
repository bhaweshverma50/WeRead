/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import helmet from "helmet";
import http from "http";

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});

/**
 *  App Configuration
 */
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    res.send("OK");
  } catch (error: any) {
    res.status(500).send(error.toString());
  }
});

io.on("connection", (socket: Socket) => {
  console.log("New user connected", socket.id);

  // socket.on("msg", (message: any) => {
  //   console.log(message);
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

/**
 * Server Activation
 */
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
