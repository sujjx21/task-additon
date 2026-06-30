import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  date: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const addTodo = (): void => {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      done: false,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo: Todo): void => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: number): void => {
    if (editText.trim() === "") return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen w-full bg-red-400 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Task Addition
        </h1>
        <p className="text-slate-500 text-sm text-center">
         Typescript Project
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a task..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.length === 0 && (
            <p className="text-slate-400 text-sm text-center">
              No tasks yet. Add one above!
            </p>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-slate-50 rounded-lg px-3 py-2"
            >
              {editingId === todo.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    autoFocus
                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => saveEdit(todo.id)}
                    className="text-green-600 text-xs font-medium hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-slate-500 text-xs font-medium hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span
                      onClick={() => toggleTodo(todo.id)}
                      className={`cursor-pointer text-sm block ${
                        todo.done
                          ? "line-through text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <span className="text-xs text-slate-400">
                      {todo.date}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-cyan-600 text-xs font-medium hover:text-cyan-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 text-xs font-medium hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}