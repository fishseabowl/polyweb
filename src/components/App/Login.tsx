import { useState } from "react";

interface LoginProps {
  onLogin: (account: string) => void;
  storedUsername: string | null;
  storedPassword: string | null;
  onGoToSetup: () => void;
}

const Login = ({
  onLogin,
  storedUsername,
  storedPassword,
  onGoToSetup,
}: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to call the backend login API
  const loginUser = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login successful, Bet history:", data.betHistory);
        onLogin(username); // Trigger the onLogin callback to update the app state after successful login
      } else {
        setErrorMessage(data.error || "Incorrect username or password");
      }
    } catch (error) {
      setErrorMessage("Failed to login. Please try again.");
    }
  };

  const handleLogin = () => {
    loginUser(username, password); // Call the login API when the user clicks the Login button
  };

  return (
    <div className="login-page">
      <h1>Login to Polymarket</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* If user doesn't have an account, provide an option to set one up */}
      {!storedUsername || !storedPassword ? (
        <p>
          No account yet?{" "}
          <button onClick={onGoToSetup} className="text-blue-500 underline">
            Set up an account here
          </button>
        </p>
      ) : null}
    </div>
  );
};

export default Login;
