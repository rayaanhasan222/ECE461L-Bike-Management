import logo from './logo.svg';
import './App.css';

import {useState} from "react"

exports.Usernames = new Array("John", "Bob");
exports.Passwords = new Array("password", "hi");



function App() {
  const [name, setName] = useState("");
  const [pwd, setPWD] = useState("");
  const [showName, setShowName] = useState(false);
  const [showPWD, setShowPWD] = useState(false);
  function handleSubmit(e){
    e.preventDefault();
    Usernames.push(name)
    Passwords.push(pwd)
    for(let i=0; i<Usernames.length; i++){
      if(name == Usernames[i]){
          setShowName(true);
      }
    }
    for(let i=0; i<Passwords.length; i++){
      if(pwd == Passwords[i]){
          setShowPWD(true);
      }
    }

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
