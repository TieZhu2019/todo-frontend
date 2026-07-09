import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/todos";

function TodoItem({ text, completed, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mb-2">
      <input type="checkbox" checked={completed} onChange={onToggle} />
      <span className={`flex-1 ${completed ? "line-through opacity-50" : ""}`}>
        {text}
      </span>
      <button
        onClick={onDelete}
        className="px-3 py-1 rounded bg-red-400 text-slate-900 text-sm font-semibold"
      >
        删除
      </button>
    </li>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // ============================================
  // 任务：把之前"只存在本地state"的逻辑，改成"向后端要数据/发数据"
  // ============================================

  // TODO 1: 组件加载时，向后端要一次初始数据
  // 用 useEffect + fetch(API_URL)，拿到数据后 setTodos(data)
  // 提示：
  useEffect(() => {
    async function loadTodos() {
      const response = await fetch(API_URL);
      const data = await response.json();//数据包整理成js可读的数据
      setTodos(data);
    }
    loadTodos();
  }, []);

  // TODO 2: 新增待办，改成向后端发POST请求
  // 之前是本地 setTodos([...todos, 新对象])
  // 现在要：
  //   1. 用 fetch(API_URL, { method: "POST", headers: {...}, body: JSON.stringify({text: value}) })
  //   2. 后端返回新增的那一条，前端再把它加进本地的todos里显示出来
  // 完整写法：
  // async function addTodo() {
  //   const value = inputValue.trim();
  //   if (value === "") return;
  //   const response = await fetch(API_URL, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ text: value }),
  //   });
  //   const newTodo = await response.json();
  //   setTodos([...todos, newTodo]);
  //   setInputValue("");
  // }
  async function addTodo() {
    // TODO: 在这里写代码
    const value = inputValue.trim();//去空格
    if (value === "") return;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });//异步后端新增
    const newTodo = await response.json();//前端显示
    setTodos([...todos, newTodo]);
    setInputValue("");
  }

  // TODO 3: 切换完成状态，改成向后端发PUT请求
  // async function toggleTodo(id) {
  //   const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });
  //   const updatedTodos = await response.json();
  //   setTodos(updatedTodos);
  // }
  async function toggleTodo(id) {
    // TODO: 在这里写代码
      const response = await fetch(`${API_URL}/${id}`, { method: "PUT" });
    const updatedTodos = await response.json();
    setTodos(updatedTodos);
  }

  // TODO 4: 删除，改成向后端发DELETE请求
  // async function deleteTodo(id) {
  //   const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  //   const updatedTodos = await response.json();
  //   setTodos(updatedTodos);
  // }
  async function deleteTodo(id) {
    // TODO: 在这里写代码
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const updatedTodos = await response.json();
    setTodos(updatedTodos);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-16 px-6">
      <h1 className="text-slate-400 text-lg mb-6">今天要做的事（数据存在后端了）</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入一件事..."
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 w-60"
        />
        <button
          onClick={addTodo}
          className="px-5 py-2 rounded-lg bg-teal-300 text-slate-900 font-semibold"
        >
          添加
        </button>
      </div>

      <ul className="w-72">
        {todos.map((item) => (
          <TodoItem
            key={item.id}
            text={item.text}
            completed={item.completed}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => deleteTodo(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}
