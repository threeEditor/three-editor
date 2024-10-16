import { useEffect } from "react";
import "./App.css";
import Layout from "./components/layout";
import { preventTouchMove, preventWheel } from "./utils/event/dom";
import { JsonViewer } from "./components/jsonViewer";

function App() {
  useEffect(() => {
    // 关闭页面的上拉、下拉
    window.addEventListener('wheel', preventWheel, { passive: false });
    window.addEventListener('touchmove', preventTouchMove)
    return () => {
        window.removeEventListener('wheel', preventWheel);
        window.removeEventListener('touchmove', preventTouchMove);
    }
})
  return (
    <div className="editor-manager">
      <Layout />
      <JsonViewer />
    </div>
  );
}

export default App;
