import React, { useState } from "react";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  const addTask = () => {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) return;

    if (editingIndex !== null) {
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks];
        updatedTasks[editingIndex] = trimmedInput;
        return updatedTasks;
      });
      setEditingIndex(null);
    } else {
      setTasks(prevTasks => [...prevTasks, trimmedInput]);
    }
    
    setInput("");
  };

  const deleteTask = (index) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    setInput(tasks[index]);
    setEditingIndex(index);
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="todo-input"
        />
        <button type="submit" className="todo-button">
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </form>
      {tasks.length > 0 ? (
        <ul className="todo-list">
          {tasks.map((task, index) => (
            <li key={index} className="todo-item">
              <span>{task}</span>
              <div className="todo-actions">
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks yet. Add some!</p>
      )}
    </div>
  );
};

export default Todo;
