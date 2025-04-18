import { useState } from "react";
import LoginForm from "./../components/loginform";
import CreateAccount from "./../components/createAccount";

export default function Start() {
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    return (
    <div className="p-4">
        <div className="flex justify-center">
            <button
                onClick={() => setIsCreatingAccount(true)}
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
                Skapa konto
            </button>
            <button
                onClick={() => setIsCreatingAccount(false)}
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition ml-4"
            >
                Login
            </button>
        </div>
    {isCreatingAccount ? (
        <CreateAccount />
    ) : (
        <LoginForm />
    )}
</div>
    );
}