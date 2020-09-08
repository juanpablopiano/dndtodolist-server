require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Set up of socket.io
const http = require("http").Server(app);
const io = require("socket.io")(http);

// set up routes
const indexRoutes = require("./routes/index.js");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// settings
app.set('socketio', io);

// mongoose config
const dbObject = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};
mongoose.connect(process.env.MONGODB_URL, dbObject);
const db = mongoose.connection;
db.once("open", () => {
	console.log("mongoose connected to db");
});

app.get("/", (req, res) => {
	res.send("Hola");
});

// use routes
app.use(indexRoutes);

const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
// 	console.log(`Listening on port: ${PORT}`);
// });

io.on("connection", (socket) => {
	console.log("A user connected");
});

http.listen(PORT, () =>
	console.log("Listening on port", PORT)
);