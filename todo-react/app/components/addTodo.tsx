import React from "react";
import { Check, Trash2 } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  checked: boolean;
  date: string;
}

interface AddTodoProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  selectedGroup: string;
}

const AddTodo: React.FC<AddTodoProps> = ({
  todo,
  onToggle,
  onRemove,
  selectedGroup,
}) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(todo.id)}
          className={`p-1 rounded-lg transition-all duration-200 ${
            todo.checked 
              ? "bg-green-500 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-green-400 hover:text-white"
          }`}
        >
          <Check size={16} />
        </button>
        <span
          className={`text-gray-800 dark:text-gray-200 flex-1 ${
            todo.checked ? "line-through text-gray-500 dark:text-gray-400" : ""
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        onClick={() => onRemove(todo.id)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default AddTodo;