import express, { Application } from "express";
import { engine } from "express-handlebars";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import socket from "./socket";
import indexRouter from "./routes/indexRouter";

const app: Application = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const HOST: string = "";
socket(io);

app.use(logger("dev"));
app.use(express.static("./public"));
app.use("/", indexRouter);

//view engine setup
app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
app.set("views", "./views");
app.set("view engine", "hbs");
//@ts-expect-error
server.listen(PORT, HOST, () =>
  console.log(`Server listenning in ${PORT}`)
);
