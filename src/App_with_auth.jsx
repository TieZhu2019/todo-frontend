import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api";

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

// ============================================
// 登录/注册表单组件（已写好）
// ============================================
function AuthForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    const endpoint = isRegister ? "register" : "login";
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "出错了");
        return;
      }
      // TODO 1: 登录/注册成功后，把 data.token 存进 localStorage
      // 提示: localStorage.setItem("token", data.token);
      // 然后调用 onLoginSuccess() 通知外层"已登录"，切换界面
      localStorage.setItem("token", data.token);
      onLoginSuccess();
    } catch (err) {
      setError("网络错误，请重试");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 w-80">
        <h1 className="text-slate-100 text-xl mb-6 text-center">
          {isRegister ? "注册" : "登录"}
        </h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="用户名"
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
        />
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <button
          onClick={handleSubmit}
          className="w-full py-2 rounded-lg bg-teal-300 text-slate-900 font-semibold mb-3"
        >
          {isRegister ? "注册" : "登录"}
        </button>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-slate-400 text-sm"
        >
          {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Todo主界面（跟之前基本一样，主要改动在fetch请求上）
// ============================================
function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // TODO 2: 写一个函数，返回请求需要的headers，每次fetch都要带上token
  // 提示：
  // function getAuthHeaders() {
  //   const token = localStorage.getItem("token");
  //   return {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`,
  //   };
  // }
  // 之后所有fetch，都要在options里加上 headers: getAuthHeaders()
  function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  }

  useEffect(() => {
    async function loadTodos() {
      // TODO 3: 这里的fetch要加上 { headers: getAuthHeaders() }
      const response = await fetch(`${API_URL}/todos`,{ headers: getAuthHeaders() });
      const data = await response.json();
      setTodos(data);
    }
    loadTodos();
  }, []);

  async function addTodo() {
    const value = inputValue.trim();
    if (value === "") return;
    // TODO 4: 这里的fetch也要加上 headers: getAuthHeaders({ "Content-Type": "application/json" })（记得POST本来就有headers，要合并一下）
    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ text: value }),
    });
    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setInputValue("");
  }

  async function toggleTodo(id) {
    const response = await fetch(`${API_URL}/todos/${id}`,{ headers: getAuthHeaders() }, { method: "PUT" });
    const updatedTodos = await response.json();
    setTodos(updatedTodos);
  }

  async function deleteTodo(id) {
    const response = await fetch(`${API_URL}/todos/${id}`,{ headers: getAuthHeaders() }, { method: "DELETE" });
    const updatedTodos = await response.json();
    setTodos(updatedTodos);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-16 px-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-slate-400 text-lg">今天要做的事</h1>
        <button onClick={onLogout} className="text-slate-500 text-sm underline">
          退出登录
        </button>
      </div>

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

// ============================================
// 顶层App：根据"有没有token"决定显示登录页还是todo页
// ============================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }
  return <TodoApp onLogout={handleLogout} />;
}
