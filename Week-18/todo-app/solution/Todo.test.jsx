import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Todo from "./Todo";
import { describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

describe("Todo App", () => {
  beforeEach(() => {
    cleanup(); // Clean up after each test
  });

  it("renders Todo component", () => {
    render(<Todo />);
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  it("adds a task when the Add button is clicked", async () => {
    render(<Todo />);
    const input = screen.getByPlaceholderText("Add a task...");
    const button = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Buy groceries");
    await userEvent.click(button);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("updates a task when the Update button is clicked", async () => {
    render(<Todo />);
    const input = screen.getByPlaceholderText("Add a task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Buy groceries");
    await userEvent.click(addButton);

    const editButton = screen.getByText("Edit");
    await userEvent.click(editButton);

    await userEvent.clear(input);
    await userEvent.type(input, "Buy groceries and cook");
    await userEvent.click(screen.getByText("Update"));

    expect(screen.getByText("Buy groceries and cook")).toBeInTheDocument();
  });

  it("deletes a task when the Delete button is clicked", async () => {
    render(<Todo />);
    const input = screen.getByPlaceholderText("Add a task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Buy groceries");
    await userEvent.click(addButton);

    const deleteButton = screen.getByText("Delete");
    await userEvent.click(deleteButton);

    expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
  });

  it("does not add empty tasks", async () => {
    render(<Todo />);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.click(addButton);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
