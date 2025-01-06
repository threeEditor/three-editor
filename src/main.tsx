import { createRoot } from 'react-dom/client'
import './style/index.css'
import Layout from "./components/layout";
import { JsonViewer } from "./components/jsonViewer";
import { usePageFix } from './utils/hook';

// 入口文件
const Page = () => {
  usePageFix();

  return (
    <div className="editor-manager">
      <Layout />
      <JsonViewer />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Page />)
