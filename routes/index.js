const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const Container = require("../models/container");
const Board = require("../models/board");

/* TODO ROUTES */
// Create new Todo
router.post("/api/todo/new", async (req, res) => {
	const todo = new Todo(req.body);

	const savedTodo = await todo.save();

	res.json(savedTodo.id);
});
// Read Todo
router.get("/api/todo/:id", async (req, res) => {
	const id = req.params.id;

	const foundTodo = await Todo.findById(id);

	res.json(foundTodo);
});
// Update Todo
router.put("/api/todo/:id", async (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updatedTodo = await Todo.findByIdAndUpdate(id, data);
	console.log(updatedTodo);
	res.json(updatedTodo);
});

// Delete a Todo
router.delete("/api/todo/:id", async (req, res) => {
	const id = req.params.id;

	const deletedTodo = await Todo.findOneAndDelete(id);

	res.json(deletedTodo);
});

/* Container Routes */
// New Container
router.post("/api/container/new", async (req, res) => {
	const container = new Container(req.body);
	const boardId = req.body.board;

	const newContainer = await container.save();

	const board = await Board.findById(boardId);
	board.containers.push(newContainer._id);

	const io = req.app.get("socketio");
	io.emit("new container", newContainer);

	await board.save();

	res.json(newContainer);
});
// GET a Container
router.get("/api/container/get/:id", async (req, res) => {
	const id = req.params.id;

	const foundContainer = await Container.findById(id);

	res.json(foundContainer);
});
// GET ALL Containers by Board ID
router.get("/api/container/all/:boardId?", async (req, res) => {
	const boardId = req.params.boardId;
	const foundContainers = await Container.find({board: boardId});

	res.json(foundContainers);
});
// Update a container
router.put("/api/container/:id", async (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updatedContainer = await Container.findByIdAndUpdate(id, data);

	res.json(updatedContainer);
});
// Delete a container
router.delete("/api/container/:id", async (req, res) => {
	const id = req.params.id;

	const deletedContainer = await Container.findByIdAndDelete(id);

	res.json(deletedContainer._id);
});

/* BOARD ROUTES */
// New Board
router.post("/api/board/new", async (req, res) => {
	const board = new Board(req.body);

	const newBoard = await board.save();

	const io = req.app.get("socketio");
	io.emit("new board", newBoard);

	res.json(newBoard);
});
// GET a Board
router.get("/api/board/get/:id", async (req, res) => {
	const id = req.params.id;

	const foundBoard = await Board.findById(id);

	res.json(foundBoard);
});
// GET all boards
router.get("/api/board/all/:user?", async (req, res) => {
	const user = req.params.user;
	const obj = user ? { author: user } : {};
	const foundBoards = await Board.find(obj);

	res.json(foundBoards);
});
// Update a Board
router.put("/api/board/:id", async (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updatedBoard = await Board.findByIdAndUpdate(id, data);

	res.json(updatedBoard);
});
// Delete a Board
router.delete("/api/board/:id", async (req, res) => {
	const id = req.params.id;

	const deletedBoard = await Board.findByIdAndDelete(id);

	res.json(deletedBoard);
});

module.exports = router;
