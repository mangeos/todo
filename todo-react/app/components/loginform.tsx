import React, { useState } from 'react';

export default function LoginForm() {
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('userName:', userName);
        console.log('Password:', password);
        // Add your login logic here
        fetch('http://localhost:8080/api/auth/login', {
         method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
             body: JSON.stringify({ "username": userName, "password": password }),
            })
            .then((response) => response.json())
            .then((data) => {
                alert('Login successful');
                console.log('Login response:', data)

                const token = data.token;

                // Spara token i localStorage
                localStorage.setItem("jwt", token);

                window.location.href = '/home';
            })
            .catch((error) => {
                alert('Login failed');
                console.error('Error logging', error)}
            );

        };

    return (
      
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Username:
                </label>
                <input
                    type="text"
                    id="email"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Login
            </button>
        </form>

    );
};
