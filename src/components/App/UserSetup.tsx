import { useState } from "react";

// Define the props for UserSetup
interface UserSetupProps {
  onSetup: (username: string, password: string) => void;
}

const UserSetup = ({ onSetup }: UserSetupProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to handle the API request to register the user
  const registerUser = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // User successfully registered, show success message
        setSuccessMessage("Account created successfully!");
        setErrorMessage("");
        onSetup(username, password); // Callback to proceed after setup
      } else {
        // If there was an error during registration, show the error message
        setErrorMessage(data.error || "Failed to create account");
        setSuccessMessage("");
      }
    } catch (error) {
      // Catch any network or server errors
      setErrorMessage("Error registering user, please try again.");
      setSuccessMessage("");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (password === confirmPassword) {
      registerUser(username, password);
    } else {
      setErrorMessage("Passwords do not match!");
    }
  };

  return (
    <div className="user-setup">
      <h1>Set up your account</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <button onClick={handleSubmit}>Set Up Account</button>
    </div>
  );
};

export default UserSetup;
