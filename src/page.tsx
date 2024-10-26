import { useEffect, useState } from "react";
import "./style/Page.less";
import Layout from "./components/layout";
import { preventTouchMove, preventWheel } from "./utils/event/dom";
import { JsonViewer } from "./components/jsonViewer";
import { EventSystem } from "./utils/event/EventSystem";
import { SystemEvents } from "./common/constant";

function Page() {
  useEffect(() => {
    // 关闭页面的上拉、下拉
    window.addEventListener('wheel', preventWheel, { passive: false });
    window.addEventListener('touchmove', preventTouchMove);
    return () => {
        window.removeEventListener('wheel', preventWheel);
        window.removeEventListener('touchmove', preventTouchMove);
    }
  }, [])

  const [aceEdit, setAceEdit] = useState(false);
  useEffect(() => {
    EventSystem.subscribe(SystemEvents.ViewAceEdit, () => setAceEdit(true));
    EventSystem.subscribe(SystemEvents.HideAceEdit, () => setAceEdit(false));
    return () => {
      EventSystem.unsubscribe(SystemEvents.ViewAceEdit);
      EventSystem.unsubscribe(SystemEvents.HideAceEdit);
    }
  }, [])

  return (
    <div className="editor-manager">
      <Layout />
      {aceEdit && <JsonViewer onClose={() => setAceEdit(false)}/>}
    </div>
  );
}

export default Page;
