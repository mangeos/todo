import React from "react";

interface Todo {
    id: number;
    text: string;
    checked: boolean;
}

interface AddTodoProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onRemove: (id: number) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ todo, onToggle, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
            <div className="flex items-center gap-2" >
                <input 
                    className="h-5 w-5 text-blue-500 cursor-pointer"
                    type="checkbox" 
                    checked={todo.checked} 
                    onChange={() => onToggle(todo.id)} 
                    
                    />
                <span className={`text-gray-800 ${todo.checked ? "line-through text-gray-500" : ""}`}>
                    {todo.text}
                </span>
            </div>
            <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition" onClick={() => onRemove(todo.id)}>Ta bort</button>
        </div>
    );
};

export default AddTodo;