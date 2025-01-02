import './index.less';
import {
  DragOutlined,
  ExpandAltOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { useEffect, useState } from 'react';
import { SceneEvents, SceneType } from '@/common/constant';
import { ViewType } from '../panel/property';
import { TransformControlsMode } from 'three/examples/jsm/Addons.js';
import { EventSystem } from '@/utils/event/EventSystem';
const Toolbar = (props: any) => {
  const [mode, setMode] = useState<TransformControlsMode | null>(null);
  const [sceneType, setSceneType] = useState(SceneType.Edit);
  const toolButtons = [
    {
      icon: DragOutlined,
      title: '移动',
      mode: 'translate',
      onClick: () => {
        SceneManager.GizmoManager.setControlsMode('translate');
      },
    },
    {
      icon: RetweetOutlined,
      title: '旋转',
      mode: 'rotate',
      onClick: () => {
        SceneManager.GizmoManager.setControlsMode('rotate');
      },
    },
    {
      icon: ExpandAltOutlined,
      title: '缩放',
      mode: 'scale',
      onClick: () => {
        SceneManager.GizmoManager.setControlsMode('scale');
      },
    },
  ];
  useEffect(() => {
    setMode(SceneManager.GizmoManager.mode);
    SceneManager.GizmoManager.on(SceneEvents.GizmoModeChange, (mode) => {
      setMode(mode);
    });
    EventSystem.subscribe(SceneEvents.ChangeSceneType, (type: SceneType) => {
      setSceneType(type);
    })
    return () => {
      SceneManager.GizmoManager.off(SceneEvents.GizmoModeChange);
      EventSystem.unsubscribe(SceneEvents.ChangeSceneType);
    }
  }, []);
  return (
    <div className={`toolbar ${sceneType === SceneType.Edit ? 'toolbar-show ': 'toolbar-hide'}`}>
      {toolButtons.map((button) => {
        return (
          <div
            className={`toolbar-button ${
              props.viewType == ViewType.Node && button.mode == mode
                ? 'active'
                : ''
            }`}
            key={button.mode}
            {...button}
          >
            <button.icon />
          </div>
        );
      })}
    </div>
  );
};

export default Toolbar;
