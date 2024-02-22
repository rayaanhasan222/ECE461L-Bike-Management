import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <form>
          <label for="UserID">UserID:</label>
          <input type="text" id="userid" name="userid"></input>
          <br></br>
          <label for="Password">Password:</label>
          <input type="text" id="password" name="password"></input>
          <br></br>
          <input type="submit"></input>
        </form>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
    </div>
  );
}

export default App;
