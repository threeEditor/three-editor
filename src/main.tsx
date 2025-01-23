// React 相关导入
import { createRoot } from 'react-dom/client'
// 全局样式
import './style/index.less'
// 组件导入
import Layout from "./layout";
import { JsonViewer } from "./components/jsonViewer";
import { usePreventScroll } from './utils/hook';

// 主页面组件
const Page = () => {
  // 阻止页面滚动，防止移动端上下拉动作影响编辑器操作
  usePreventScroll();

  return (
    // 编辑器根容器
    <div className="editor-manager">
      {/* 主布局组件，包含编辑器核心功能 */}
      <Layout />
      {/* JSON 预览器，用于展示和调试数据 */}
      <JsonViewer />
    </div>
  );
}

// 将应用挂载到 DOM
createRoot(document.getElementById('root')!).render(<Page />)
