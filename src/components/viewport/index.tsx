import { useEffect, useRef } from 'react';
import './index.less';
import EditManager from '../../edit/core';
import SceneManager from '@/edit/sceneManager/sceneManager';

interface IViewPortProps {
  onLoad: (edit: EditManager) => void;
}

export interface ViewRef {
  edit: EditManager;
}

const ViewPort = (props: IViewPortProps) => {
  const { onLoad } = props;
  const view = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!view.current) return;
    const editManager = new EditManager(view.current);
    editManager.setUp();
    const resources = SceneManager.resources;
    resources.on('loaded',()=>{
      onLoad(editManager);
    })
    return () => {
      editManager.destroy();
    };
  }, []);
  return <div id="viewport_container" ref={view} />;
};

export default ViewPort;
