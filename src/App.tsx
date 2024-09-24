import { useState } from "react";
import "./App.css";
import ViewPort from "./components/viewport";

function App() {
  const [count, setCount] = useState(0);

  return <>
    <h2>ThreeJs-editor</h2>
    <div style={{
      width: '600px',
      height: '400px',
      border: '1px solid'
    }}>
    <ViewPort />
    </div>
    
  </>;
}

export default App;
