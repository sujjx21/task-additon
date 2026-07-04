import { useState } from "react";

type Priority = "High" | "Medium" | "Low";
type Filter = "All" | "Upcoming" | "Completed" | "Overdue";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  date: string;
  priority: Priority;
  dueDate: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editPriority, setEditPriority] = useState<Priority>("Medium");
  const [editDueDate, setEditDueDate] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("All");

  const priorityOrder: Record<Priority, number> = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const priorityColor: Record<Priority, string> = {
    High: "text-red-500 bg-red-50",
    Medium: "text-yellow-600 bg-yellow-50",
    Low: "text-green-600 bg-green-50",
  };

  const today = new Date(new Date().toDateString());

  const isOverdue = (due: string, done: boolean): boolean => {
    if (!due || done) return false;
    return new Date(due) < today;
  };

  const isUpcoming = (due: string, done: boolean): boolean => {
    if (!due || done) return false;
    const dueD = new Date(due);
    const diffDays = Math.ceil(
      (dueD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 0 && diffDays <= 3;
  };

  const getDaysLeft = (due: string): string => {
    const dueD = new Date(due);
    const diffDays = Math.ceil(
      (dueD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Due Today!";
    if (diffDays === 1) return "Due Tomorrow";
    return `Due in ${diffDays} days`;
  };

  const addTodo = (): void => {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      done: false,
      priority,
      dueDate,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setTodos([...todos, newTodo]);
    setInput("");
    setPriority("Medium");
    setDueDate("");
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
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate);
  };

  const saveEdit = (id: number): void => {
    if (editText.trim() === "") return;
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: editText, priority: editPriority, dueDate: editDueDate }
          : todo
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText("");
  };

  const sortedTodos = [...todos].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const filteredTodos = sortedTodos.filter((todo) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return isUpcoming(todo.dueDate, todo.done);
    if (filter === "Completed") return todo.done;
    if (filter === "Overdue") return isOverdue(todo.dueDate, todo.done);
    return true;
  });

  const completed = todos.filter((t) => t.done).length;
  const upcomingCount = todos.filter((t) => isUpcoming(t.dueDate, t.done)).length;
  const overdueCount = todos.filter((t) => isOverdue(t.dueDate, t.done)).length;

  const filterButtons: { label: string; value: Filter; count?: number; color: string }[] = [
    { label: "All", value: "All", count: todos.length, color: "bg-slate-100 text-slate-600" },
    { label: "Upcoming", value: "Upcoming", count: upcomingCount, color: "bg-blue-50 text-blue-600" },
    { label: "Completed", value: "Completed", count: completed, color: "bg-green-50 text-green-600" },
    { label: "Overdue", value: "Overdue", count: overdueCount, color: "bg-red-50 text-red-500" },
  ];

  return (
    <div className="min-h-screen w-full bg-red-400 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Task Addition
        </h1>
        <p className="text-slate-500 text-sm text-center">Typescript Project</p>

        {/* Progress */}
        {todos.length > 0 && (
          <div className="text-center text-xs text-slate-500">
            {completed} of {todos.length} tasks completed
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-cyan-600 h-1.5 rounded-full transition-all"
                style={{ width: `${(completed / todos.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  filter === btn.value
                    ? btn.color + " ring-1 ring-current"
                    : "text-slate-400 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {btn.label}
                {btn.count !== undefined && btn.count > 0 && (
                  <span className="font-bold">{btn.count}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Upcoming Banner */}
        {upcomingCount > 0 && filter === "All" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-blue-600">
              📅 {upcomingCount} task{upcomingCount > 1 ? "s" : ""} due in the next 3 days
            </p>
            <ul className="mt-1 space-y-0.5">
              {todos
                .filter((t) => isUpcoming(t.dueDate, t.done))
                .map((t) => (
                  <li key={t.id} className="text-xs text-blue-500 flex justify-between">
                    <span className="truncate">{t.text}</span>
                    <span className="ml-2 font-medium shrink-0">{getDaysLeft(t.dueDate)}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
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

          {/* Due Date */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 shrink-0">Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Priority */}
          <div className="flex gap-2 justify-center">
            {(["High", "Medium", "Low"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  priority === p
                    ? priorityColor[p] + " border-current"
                    : "text-slate-400 border-slate-200 hover:border-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTodos.length === 0 && (
            <p className="text-slate-400 text-sm text-center">
              {filter === "All"
                ? "No tasks yet. Add one above!"
                : `No ${filter.toLowerCase()} tasks.`}
            </p>
          )}
          {filteredTodos.map((todo, index) => (
            <li
              key={todo.id}
              className={`rounded-lg px-3 py-2 ${
                isOverdue(todo.dueDate, todo.done)
                  ? "bg-red-50 border border-red-200"
                  : isUpcoming(todo.dueDate, todo.done)
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-slate-50"
              }`}
            >
              {editingId === todo.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    autoFocus
                    className="w-full border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 shrink-0">Due:</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setEditPriority(p)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          editPriority === p
                            ? priorityColor[p] + " border-current"
                            : "text-slate-400 border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <div className="ml-auto flex gap-2">
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
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 mt-0.5 w-4 shrink-0">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColor[todo.priority]}`}
                      >
                        {todo.priority}
                      </span>
                      {isOverdue(todo.dueDate, todo.done) && (
                        <span className="text-xs font-medium text-red-500">⚠ Overdue</span>
                      )}
                      {isUpcoming(todo.dueDate, todo.done) && (
                        <span className="text-xs font-medium text-blue-500">
                          📅 {getDaysLeft(todo.dueDate)}
                        </span>
                      )}
                    </div>
                    <span
                      onClick={() => toggleTodo(todo.id)}
                      className={`cursor-pointer text-sm block mt-0.5 ${
                        todo.done ? "line-through text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-400">Added: {todo.date}</span>
                      {todo.dueDate && (
                        <span
                          className={`text-xs font-medium ${
                            isOverdue(todo.dueDate, todo.done)
                              ? "text-red-500"
                              : "text-slate-500"
                          }`}
                        >
                          Due:{" "}
                          {new Date(todo.dueDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${
                        todo.done
                          ? "text-green-600 border-green-300 bg-green-50"
                          : "text-slate-400 border-slate-300 hover:text-green-600 hover:border-green-300"
                      }`}
                    >
                      {todo.done ? "✓ Done" : "Complete"}
                    </button>
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