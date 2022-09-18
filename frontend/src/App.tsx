import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0)
  const socket = io("https://bhaweshverma50-weread-w5rrxr6v6wr3v9w6-5005.githubpreview.dev/");

  socket.on("connect", () => {
    console.log(socket.id);
  });

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 5)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
