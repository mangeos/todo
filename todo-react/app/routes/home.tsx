import { useEffect, useState } from "react";
import AddTodo from "~/components/addTodo";

interface Todo {
    id: number;
    text: string;
    checked: boolean;
    date: string; 
}
const API_URL = "http://localhost:8080/todos";

const Home = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // Lägg till state för datum

    // Hämta todos från backend vid sidans öppning
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Få dagens datum i formatet YYYY-MM-DD
        setSelectedDate(today);
        fetchTodosByDate(today);
    }, []);

    const fetchTodosByDate = (date: string) => {
        fetch(`${API_URL}/date?date=${date}`)
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching todos by date:", error));
    };

    // Funktion för att lägga till en ny todo
    const addTodo = () => {
        if (inputValue.trim() === "") return; // Undvik tomma todos

        const newTodo = { id: Date.now(), text: inputValue, checked: false, date: selectedDate };
        setInputValue(""); // Rensa inputfältet efter att todo har lagts till
        //setSelectedDate(""); // Rensa datumfältet efter att todo har lagts till

        // skicka till backend
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        })
            .then((response) => response.json())
            .then((data) => setTodos([...todos, data]))
            .catch((error) => console.error("Error adding todo:", error));
    };

    // Funktion för att toggla "checked"-status
    const toggleChecked = (id: number) => {
        let todo = todos.find(todo => todo.id === id);
        if (!todo) return;
        todo.checked = !todo.checked;
        // skicka uppdaterade todo till backend
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        })
            .then((response) => response.json())
            .then((data) => setTodos(todos.map(todo =>
                todo.id === id ? data : todo
            )))
            .catch((error) => console.error("Error toggling todo:", error));
    };

    // Funktion för att ta bort en todo
    const removeTodo = (id: number) => {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then(() => setTodos(todos.filter(todo => todo.id !== id)))
            .catch((error) => console.error("Error removing todo:", error));
    };

    return (
        <div className="mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg" style={{maxWidth:"35rem"}}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Todo List</h2>
            <div className="flex gap-2 mb-4">
                <input
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTodo();
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
                        fetchTodosByDate(e.target.value); // Hämta todos baserat på valt datum
                    }}
                />
                <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Lägg till</button>
            </div>

            <div className="space-y-2">
                {todos.map(todo => (
                    <AddTodo
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleChecked}
                        onRemove={removeTodo}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;