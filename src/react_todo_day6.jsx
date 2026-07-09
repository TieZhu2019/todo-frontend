import { useState } from "react";

// ============================================
// 子组件：TodoItem，只负责"展示一条待办"
// 不自己存状态，所有数据和行为都通过props从父组件传入
// ============================================
function TodoItem({ text, completed, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mb-2">
      {/* TODO 1: 加一个checkbox
          - checked 属性要绑定 completed
          - onChange 事件要调用 onToggle（父组件传下来的函数）
          提示: <input type="checkbox" checked={completed} onChange={onToggle} /> */}
          <input type="checkbox" checked={completed} onChange={onToggle} />

      <span
        className={`flex-1 ${completed ? "line-through opacity-50" : ""}`}
      >
        {text}
      </span>

      {/* TODO 2: 加一个删除按钮
          - onClick 调用 onDelete（父组件传下来的函数）
          提示: <button onClick={onDelete} className="...">删除</button> */}
          <button onClick={onDelete} className="...">删除</button>
    </li>
  );
}

// ============================================
// 父组件：App，管理整个todos数组这个"唯一数据源"
// ============================================
export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "学习React", completed: false },
    { id: 2, text: "写今天的项目", completed: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  function addTodo() {
    const value = inputValue.trim();
    if (value === "") return;

    // TODO 3: 把新的一条加入todos数组
    // 提示：不能直接 todos.push(...)，React要求生成"新数组"
    // 用扩展运算符：const newTodos = [...todos, { id: Date.now(), text: value, completed: false }];
    // 然后 setTodos(newTodos)
    // Date.now() 是拿当前时间戳当唯一id，比用index更靠谱
    const newTodos =[...todos,{id:Date.now(), text:value,completed:false}];
    setTodos(newTodos);

    setInputValue("");
  }

  function toggleTodo(id) {
    // TODO 4: 找到id匹配的那一条，把它的completed取反，其它不变
    // 提示用map，返回一个新数组：
    // const newTodos = todos.map((item) =>
    //   item.id === id ? { ...item, completed: !item.completed } : item
    // );
    // setTodos(newTodos);
    // 这里 {...item, completed: !item.completed} 的意思是：
    
    // 这是React里"不直接修改原对象，生成新对象"的标准写法
    const newTodos =todos.map((item)=>
    item.id === id ? {...item,completed:!item.completed}:item
    );// "复制item这个对象的所有字段，但把completed字段换成取反后的值"
    setTodos(newTodos);
  }

  function deleteTodo(id) {
    // TODO 5: 用filter，把id不等于传入id的项都留下
    // const newTodos = todos.filter((item) => item.id !== id);
    // setTodos(newTodos);
    const newTodos = todos.filter((item)=>item.id!== id);//filter过滤器
    setTodos(newTodos)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-16 px-6">
      <h1 className="text-slate-400 text-lg mb-6">今天要做的事</h1>

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
        {/* TODO 6: 用map把todos渲染成TodoItem列表
            每个TodoItem要传：key（用item.id）、text、completed、
            onToggle（传一个箭头函数：() => toggleTodo(item.id)）、
            onDelete（同理：() => deleteTodo(item.id)）

        */}
        {
          todos.map((item)=>(
            <TodoItem 
            key={item.id} 
            text={item.text} 
            completed={item.completed}
            onToggle={()=> toggleTodo(item.id)}
            onDelete={()=> deleteTodo(item.id)}
            />
          ))
        }
      </ul>
    </div>
  );
}
