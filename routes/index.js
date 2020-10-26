const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const Container = require("../models/container");
const Board = require("../models/board");

/* TODO ROUTES */
// Create new Todo
router.post("/api/todo/new", async (req, res) => {
	const todo = new Todo(req.body);

	try {
		const savedTodo = await todo.save();

		const container = await Container.findById(savedTodo.container);
		container.todos.push(savedTodo._id);

		const io = req.app.get("socketio");
		io.emit("new todo", savedTodo);
		await container.save();
		res.json(savedTodo.id);
	} catch (error) {
		console.log(error);
		res.sendStatus(503);
	}
});
// READ a Todo
router.get("/api/todo/get/:id", async (req, res) => {
	const id = req.params.id;

	const foundTodo = await Todo.findById(id);

	res.json(foundTodo);
});
// READ ALL Todos
router.get("/api/todo/all/:containerId?", async (req, res) => {
	const containerId = req.params.containerId;

	const foundTodos = await Todo.find({ container: containerId });

	res.json(foundTodos);
});
// READ ALL Todos by board
router.get("/api/todo/all/board/:boardId?", async (req, res) => {
	const boardId = req.params.boardId;

	const foundTodos = await Todo.find({ board: boardId });

	res.json(foundTodos);
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

	const deletedTodo = await Todo.findByIdAndDelete(id);

	const io = req.app.get("socketio");
	io.emit("deleted todo", deletedTodo._id);

	res.json(deletedTodo._id);
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
	const foundContainers = await Container.find({ board: boardId });

	res.json(foundContainers);
});
// GET ALL Containers by Board ID and Todo Populated
router.get("/api/container/all/full/:boardId?", async (req, res) => {
	const boardId = req.params.boardId;
	const foundContainers = await Container.find({ board: boardId }).populate("todos").exec();

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
	await Todo.deleteMany({ container: id });

	const io = req.app.get("socketio");
	io.emit("deleted container", deletedContainer._id);

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
	await Container.deleteMany({ board: id });
	await Todo.deleteMany({ board: id });

	const io = req.app.get("socketio");
	io.emit("deleted board", deletedBoard._id);

	res.json(deletedBoard._id);
});

module.exports = router;
