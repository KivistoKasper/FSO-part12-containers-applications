const express = require("express");
const router = express.Router();

const configs = require("../util/config");
const redis = require("../redis");

let visits = 0;

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
  });
});

router.get("/statistics", async (req, res) => {
  const todoString = await redis.getAsync("added_todos");
  const todoInt = parseInt(todoString);
  if (Number.isInteger(todoInt)) {
    res.json({
      added_todos: todoInt,
    });
  } else {
    res.json({
      added_todos: 0,
    });
  }
});

module.exports = router;
