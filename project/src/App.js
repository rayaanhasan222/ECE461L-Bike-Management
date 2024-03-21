import logo from './logo.svg';
import './App.css';

import {useState} from "react"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
Usernames = new Array("John", "Bob");
Passwords = new Array("password", "hi");


function EnterQty(props){
  return (<TextField label={props.input} variant="filled" size='small' className='text'></TextField>);
}
function Enter(props){
  const [buttonText, setButtonText] = useState('Sign Up ');
  function clickButton(e){
    e.preventDefault();
    if(buttonText==="Join "){
      setButtonText('Leave ');
    }
    else{
      setButtonText('Join ');
    }
    // setButtonText(buttonText === 'Join ' ? 'Leave ' : 'Join ');
  }
  return <Button variant="contained" onClick={clickButton}>{buttonText}{props.pname}</Button>;
}
function App() {
  // const [name, setName] = useState("");
  // const [pwd, setPWD] = useState("");
  // const [showName, setShowName] = useState(false);
  // const [showPWD, setShowPWD] = useState(false);
  // function handleSubmit(e){
  //   e.preventDefault();
  //   fetch('/login', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       username: name,
  //       password: pwd
  //     })
  //   })
    
    // for(let i=0; i<Usernames.length; i++){
    //   if(name == Usernames[i]){
    //       setShowName(true);
    //   }
    // }
    // for(let i=0; i<Passwords.length; i++){
    //   if(pwd == Passwords[i]){
    //       setShowPWD(true);
    //   }
    // }
  // }
  return (
    <div class="Login">
      <div class="returningUser">
        <h1>
          Returning User Login
        </h1>
        <div class="inputBox">
          
            <h2 id="phead">UserID:</h2>
            <EnterQty input={'Username'}></EnterQty>
            <h2 id="phead">Password:</h2>
            <EnterQty input={'Password'}></EnterQty>
            <div>
              <Enter></Enter>
            </div>
        </div>
      </div>
      <div class="newUser">
        <h1>
          New User Sign Up
        </h1>
        <div class="inputBox">
          <h2 id="phead">UserID:</h2>
          <EnterQty input={'Username'}></EnterQty>
        </div>
        <div class="inputBox">
          <h2 id="phead">Password:</h2>
          <EnterQty input={'Password'}></EnterQty>
        </div>
      </div>
      
    </div>
  );
}

export default App;
=
