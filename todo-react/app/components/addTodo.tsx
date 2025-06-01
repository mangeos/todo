import React from "react";
import GroupMembers from "./groupMembers";

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
    <>
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <input
            className="h-5 w-5 text-blue-500 cursor-pointer flex-shrink-0"
            type="checkbox"
            checked={todo.checked}
            onChange={() => onToggle(todo.id)}
          />
          <span
            className={`text-gray-800 ${
              todo.checked ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.text}
          </span>
        </div>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          onClick={() => onRemove(todo.id)}
          style={{ minWidth: "5rem" }}
        >
          Ta bort
        </button>
      </div>
      <GroupMembers
        groupname={selectedGroup} // Skicka det valda gruppnamnet eller en tom sträng
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">
          <strong>Add Member</strong>
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Hantera formulärets inlämning här
            alert("Member added!"); //
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Enter member name"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTodo;
