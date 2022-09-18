import express, { Router, Request, Response } from "express";
import { Server } from "socket.io";

const routes: Router = express.Router();
const io = new Server();

// routes.get("/", async (req: Request, res: Response) => {
//   try {
//     res.send("OK");
//   } catch (error: any) {
//     res.status(500).send(error.toString());
//   }
// });

io.on("connection", function (socket: any) {
  console.log("a user connected");

  socket.on("message", function (message: any) {
    console.log(message);
  });
});

export default routes;
