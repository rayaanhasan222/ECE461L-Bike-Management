import './App.css';

import {useState} from "react"

export const Usernames = ["John", "Bob"];
export const Passwords = ["password", "hi"];



function App() {
  const [name, setName] = useState("");
  const [pwd, setPWD] = useState("");
  const [showName, setShowName] = useState(false);
  const [showPWD, setShowPWD] = useState(false);
  function handleSubmit(e){
    e.preventDefault();
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: name,
        password: pwd
      })
    })
    
  }
  return (
    <div className="App">
      <header className="App-header">
        
        <form>
          <label for="UserID">UserID:</label>
          <input type="text" id="userid" name="userid" value={name} 
            onChange={(e)=>setName(e.target.value)}
          ></input>
          <br></br>
          <label for="Password">Password:</label>
          <input type="text" id="password" name="password" value={pwd} 
            onChange={(e)=>setPWD(e.target.value)}></input>
          <br></br>
          <button onClick={handleSubmit} type="submit">
            Submit
          </button>
          {showName === true && <p>{name}</p>}
          {showPWD === true && <p>{pwd}</p>}
        </form>
        
      </header>
      
      
    </div>
  );
}

export default App;
