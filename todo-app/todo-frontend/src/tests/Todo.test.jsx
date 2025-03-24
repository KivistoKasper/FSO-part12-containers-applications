import { render, screen } from "@testing-library/react";
import Todo from "../Todos/Todo";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

test("Renders a todo item correctly", () => {
  const todo = {
    text: "testing testing",
    done: false,
  };

  const deleteTodoFoo = async (todo) => {};

  const completeTodoFoo = async (todo) => {};

  render(
    <Todo
      todo={todo}
      deleteTodo={deleteTodoFoo}
      completeTodo={completeTodoFoo}
    />
  );

  const element = screen.getByText("testing testing");
  expect(element).toBeDefined();
});
