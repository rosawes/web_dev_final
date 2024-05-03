import React, { useState } from "react";
import logo from './EpicNotesLogo.jpeg';
import "./App.css";


function Login({ onLogin, onThemeSelect}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState('default');


  // triggered when the sign up button is clicked
  // saved user and pass to local storage then triggers handleLogin
  const handleSignup = () => {
    const usersRaw = localStorage.getItem("users")
    // const hash = bcrypt.hash(password)
    const hash = password;
    let users = JSON.parse(usersRaw)
    console.log(users)
    if(users && typeof users === 'object'){
      if(username in users){
          setError(true);
          return;
      }
    }
    else{
      users = {}
    }
    users[username] = hash
    localStorage.setItem("users", JSON.stringify(users));
    handleLogin()
  };

  // checks if user and pass is stored in local storage, login = true
  // triggers theme selection
  const handleLogin = () => {
    if (username === "testuser" && password === "password") {
      
      onThemeSelect(theme);
      onLogin(true);
    } else {
    const usersRaw = localStorage.getItem("users")
    // const hash = bcrypt.hash(password)
    const hash = password;
    const users = JSON.parse(usersRaw)
    if(users[username] !== hash){
      setError(true);
      alert("Invalid username or password");
      onLogin(false);
    }else{
      const authState = {
        "auth": true,
        "username": username
      }
      console.log(authState)
      localStorage.setItem("authenticated", JSON.stringify(authState))
      onLogin(true);
    }
    }
    
  };

  return (
    <div>
    <div className="loginLogo">
      <img src={logo} alt="Epic Notes Logo" style={{ width: "130px" }} /> 
      <div className="loginWord">
      <h2>Login</h2>
      </div>
      </div>
      
      <input
        type="text"
        placeholder="Username"
        value={username}
        color={error ? "red" : ""}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        color={error ? "red" : ""}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <div style = {{marginTop: '20px'}}>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
      </div>
      </div>
    
  );
}

export default Login;