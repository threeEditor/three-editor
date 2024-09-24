import { useEffect, useRef } from "react";
import "./App.css";
import EditManager from "./edit/core";
function App() {
  const instance = useRef<EditManager>();
  useEffect(() => {
    const appDom = document.getElementById("editCanvas");
    if (appDom && !instance.current) {
      instance.current = new EditManager(appDom);
    }
  }, []);
  return (
    <>
      <div id="editCanvas"></div>
    </>
  );
}

export default App;
