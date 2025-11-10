import { useEffect, useState } from "react";
import AddTodo from "~/components/addTodo";
import GroupMembers from "~/components/groupMembers";
import { Plus, Calendar, ArrowLeft, Users, Trash2, UserPlus, User } from "lucide-react";

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
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    fetchGroups();
    extractUsernameFromToken();
  }, []);

  const extractUsernameFromToken = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        // JWT token består av header.payload.signature
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.sub || "User");
      } catch (error) {
        console.error("Error extracting username from token:", error);
        setUsername("User");
      }
    }
  };

  const fetchGroups = () => {
    const token = localStorage.getItem("jwt");
    fetch(`${API_URL}/group`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: Group[]) => {
        setGroups(data);
      })
      .catch((error) => console.error("Error fetching groups:", error));
  };

  const addGroup = () => {
    if (groupName.trim() === "") return;
    fetch(`${API_URL}/group`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
    const token = localStorage.getItem("jwt");
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => setTodos([...todos, data]))
      .catch((error) => console.error("Error adding todo:", error));
  };

  const fetchTodosByGroup = (groupName: string, date: string) => {
    const token = localStorage.getItem("jwt");
    fetch(`${API_URL}/todos/group/date?groupName=${groupName}&date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched todos:", data);
        setTodos(data);
      })
      .catch((error) => console.error("Error fetching todos by group:", error));
  };

  const deleteGroup = (groupName: string) => {
    const token = localStorage.getItem("jwt");
    fetch(`${API_URL}/todos/group/${groupName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => setGroups(groups.filter((group) => group.name !== groupName)))
      .catch((error) => console.error("Error removing group:", error));
  };

  const toggleChecked = (id: number) => {
    const token = localStorage.getItem("jwt");
    let todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    todo.checked = !todo.checked;

    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data: Todo = JSON.parse(text);
          setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
        } catch (error) {
          console.error("Error parsing JSON:", error, "Response text:", text);
        }
      })
      .catch((error) => console.error("Error toggling todo:", error));
  };

  const removeTodo = (id: number) => {
    const token = localStorage.getItem("jwt");
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((error) => console.error("Error removing todo:", error));
  };

const addMemberToGroup = (memberName: string): Promise<boolean> => {
  const token = localStorage.getItem("jwt");
  if (!selectedGroup || !memberName.trim()) {
    return Promise.reject(new Error('Group not selected or member name empty'));
  }

  return fetch(`http://localhost:8080/groupmembers/${selectedGroup}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: memberName.trim() }),
  })
    .then(response => {
      if (response.ok) {
        window.dispatchEvent(new Event('memberAdded'));
        return true;
      }
      throw new Error('Failed to add member');
    })
    .catch(error => {
      console.error("Error adding member:", error);
      throw error;
    });
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header med titel och användarinformation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                TodoApp
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Organize your tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
              <User size={20} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inloggad som</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">{username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Huvudinnehåll */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          {!selectedGroup ? (
            <div className="space-y-6">
              <div className="flex gap-3">
                <input
                  className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addGroup();
                    }
                  }}
                />
                <button
                  onClick={addGroup}
                  className="bg-green-500 text-white px-6 py-4 rounded-xl hover:bg-green-600 transition-colors font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  Add Group
                </button>
              </div>

              <div className="grid gap-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => {
                      setSelectedGroup(group.name);
                      setGroupId(group.id);
                      fetchTodosByGroup(group.name, selectedDate);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Users size={20} className="text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                        {group.name}
                      </h3>
                    </div>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group.name);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    const today = new Date().toISOString().split("T")[0];
                    setSelectedDate(today);
                  }}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Groups
                </button>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedGroup}
                </h3>
              </div>

              <div className="flex gap-3 mb-6">
                <input
                  className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTodo();
                    }
                  }}
                  placeholder="Add a new task..."
                />
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="p-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      fetchTodosByGroup(selectedGroup, e.target.value);
                    }}
                  />
                </div>
                <button
                  onClick={addTodo}
                  className="bg-blue-500 text-white px-6 py-4 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {todos.map((todo) => (
                  <AddTodo
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleChecked(todo.id)}
                    onRemove={() => removeTodo(todo.id)}
                    selectedGroup={selectedGroup || ""}
                  />
                ))}
                {todos.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <Calendar size={48} className="mx-auto" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No tasks for this date
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Add a task to get started
                    </p>
                  </div>
                )}
              </div>

          {/* GROUP MANAGEMENT SECTION */}
<div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
  <div className="flex items-center gap-2 mb-4">
    <UserPlus size={24} className="text-blue-500" />
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
      Group Management
    </h2>
  </div>
  
  <GroupMembers groupname={selectedGroup} />
  
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
      Add New Member
    </h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const memberName = formData.get("memberName") as string;
        
        if (memberName.trim()) {
          addMemberToGroup(memberName)
            .then(() => {
              e.currentTarget.reset();
              alert("Member added successfully!");
            })
            .catch((error) => {
              console.error("Error adding member:", error);
              alert("Failed to add member");
            });
        }
      }}
      className="flex items-center gap-2"
    >
      <input
        name="memberName"
        type="text"
        placeholder="Enter member name"
        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
      >
        Add Member
      </button>
    </form>
  </div>
</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;