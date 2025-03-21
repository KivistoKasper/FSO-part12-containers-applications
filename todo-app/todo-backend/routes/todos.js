const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();

const redis = require("../redis");

let added_todos = 0;

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const todoString = await redis.getAsync("added_todos");
  let todoInt = parseInt(todoString);
  const newTodoInt = todoInt + 1;
  //console.log("got ", todoInt);
  //console.log("now ", newTodoInt);
  await redis.setAsync("added_todos", newTodoInt);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const id = req.todo.id;
  const todo = {
    text: req.body.text,
    done: req.body.done,
  };
  console.log(todo);
  const todoUpdate = await Todo.findByIdAndUpdate(id, todo, { new: true });
  res.send(todoUpdate); // Implement this
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
