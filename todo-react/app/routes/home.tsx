import { useEffect, useState } from "react";
import AddTodo from "~/components/addTodo";

interface Todo {
  id: number;
  text: string;
  checked: boolean;
  date: string;
}

interface Group {
  name: string;
  id: number;
}

const API_URL = "http://localhost:8080";

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Hämta grupper från backend vid sidans öppning
  useEffect(() => {
    //console.log("fetching groups");

    const today = new Date().toISOString().split("T")[0]; // Få dagens datum i formatet YYYY-MM-DD
    setSelectedDate(today);
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    // Anta att vi har en endpoint för att hämta alla unika gruppnamn
    fetch(`${API_URL}/group`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Group[]) => {
        // const uniqueGroups = data.map((group: Group) => group.name);
        setGroups(data);

        // setTodos(data);
      })
      .catch((error) => console.error("Error fetching groups:", error));
  };

  const addGroup = () => {
    if (groupName.trim() === "") return;
    fetch(`${API_URL}/group`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Skicka token i Authorization-headern
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: groupName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroups([...groups, data]);
        setGroupName("");
      })
      .catch((error) => console.error("Error adding group:", error));
  };

  const addTodo = () => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    if (inputValue.trim() === "" || !selectedGroup) return;

    const newTodo = {
      text: inputValue,
      checked: false,
      date: selectedDate,
      groupName: selectedGroup,
    };
    setInputValue("");

    fetch(`${API_URL}/todos?groupId=${groupId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
        "Content-Type": "application/json", // Lägg till detta
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => setTodos([...todos, data]))
      .catch((error) => console.error("Error adding todo:", error));
  };

  const fetchTodosByGroup = (groupName: string, date: string) => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    console.log(token);
    fetch(`${API_URL}/todos/group/date?groupName=${groupName}&date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }) // Skicka token i Authorization-headern
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched todos:", data);
        setTodos(data);
      })
      .catch((error) => console.error("Error fetching todos by group:", error));
  };

  const deleteGroup = (groupName: string) => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    fetch(`${API_URL}/todos/group/${groupName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
        "Content-Type": "application/json",
      },
    })
      .then(() => setGroups(groups.filter((group) => group.name !== groupName)))
      .catch((error) => console.error("Error removing group:", error));
  };

  const toggleChecked = (id: number) => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    let todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    todo.checked = !todo.checked;

    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Read the response as text
      })
      .then((text) => {
        try {
          const data: Todo = JSON.parse(text); // Parse the response as JSON
          setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
        } catch (error) {
          console.error("Error parsing JSON:", error, "Response text:", text);
        }
      })
      .catch((error) => console.error("Error toggling todo:", error));
  };

  //   const toggleChecked = (id: number) => {
  //     const token = localStorage.getItem("jwt"); // Hämta token från localStorage
  //     let todo = todos.find((todo) => todo.id === id);
  //     if (!todo) return;
  //     todo.checked = !todo.checked;

  //     fetch(`${API_URL}/todos/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
  //         "Content-Type": "application/json", // Lägg till detta
  //       },
  //       body: JSON.stringify(todo),
  //     })
  //       .then((response) => response.json())
  //       .then((data: Todo) =>
  //         setTodos(todos.map((todo) => (todo.id === id ? data : todo)))
  //       )
  //       .catch((error) => console.error("Error toggling todo:", error));
  //   };

  const removeTodo = (id: number) => {
    const token = localStorage.getItem("jwt"); // Hämta token från localStorage
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Skicka token i Authorization-headern
      },
    })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((error) => console.error("Error removing todo:", error));
  };

  return (
    <div
      className="mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
      style={{ maxWidth: "35rem" }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Todo List
      </h2>

      {!selectedGroup ? (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Lägg till en grupp..."
            />
            <button
              onClick={() => addGroup()}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Lägg till grupp
            </button>
          </div>

          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className="cursor-pointer flex justify-between"
              >
                <h2
                  className="text-lg text-gray-800 mb-2"
                  onClick={() => {
                    setSelectedGroup(group.name);
                    setGroupId(group.id);
                    fetchTodosByGroup(group.name, selectedDate);
                  }}
                >
                  <strong>{group.name}</strong>
                </h2>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  onClick={() => {
                    deleteGroup(group.name);
                    alert(`Remove Group with name: ${group.name}`);
                  }}
                  style={{ minWidth: "5rem" }}
                >
                  Ta bort grupp
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedGroup(null);
              const today = new Date().toISOString().split("T")[0]; // Få dagens datum i formatet YYYY-MM-DD
              setSelectedDate(today);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition mb-4"
          >
            Tillbaka till grupper
          </button>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                  //alert("Add Todo!!");
                }
              }}
              placeholder="Lägg till en uppgift..."
            />
            <input
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                fetchTodosByGroup(selectedGroup, e.target.value);
              }}
            />
            <button
              onClick={() => addTodo()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Lägg till
            </button>
          </div>

          <div className="space-y-2">
            {todos.map((todo) => (
              <AddTodo
                key={todo.id}
                todo={todo}
                onToggle={() => toggleChecked(todo.id)}
                onRemove={() => removeTodo(todo.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
