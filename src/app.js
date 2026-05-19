import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

mongoose.connect(
	"mongodb+srv://nodePractice:JI2hU5shOriMfPyp@wineshop.5hd4ct8.mongodb.net/computer?appName=Computer-Shop",
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () =>
	console.log(`Server running on port ${PORT}`),
);
const io = new Server(httpServer);

io.on("connection", (socket) => {
	console.log("Cliente conectado");
});

app.set("socketio", io);
