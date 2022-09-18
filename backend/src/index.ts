/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
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
const server = new http.Server(app)

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/", routes);

/**
 * Server Activation
 */

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
