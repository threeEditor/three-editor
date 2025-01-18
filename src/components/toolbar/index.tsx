import './index.less';
import {
  AimOutlined,
  DragOutlined,
  ExpandAltOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { useEffect, useState } from 'react';
import { SceneEvents, SceneType } from '@/common/constant';
import { EventSystem } from '@/utils/event/EventSystem';
import React from 'react';
import { IGizmoMode } from '@/edit/gizmo';
const Toolbar = () => {
  const [mode, setMode] = useState<IGizmoMode>('view');
  const [sceneType, setSceneType] = useState(SceneType.Edit);
  const toolButtons = [
    {
      icon: AimOutlined,
      title: '观察', // 默认选中
      mode: 'view',
      onClick: () => {
        setMode('view');
        SceneManager.GizmoManager.setControlsMode('view');
      },
    },
    {
      icon: DragOutlined,
      title: '移动',
      mode: 'translate',
      onClick: () => {
        setMode('translate');
        SceneManager.GizmoManager.setControlsMode('translate');
      },
    },
    {
      icon: RetweetOutlined,
      title: '旋转',
      mode: 'rotate',
      onClick: () => {
        setMode('rotate');
        SceneManager.GizmoManager.setControlsMode('rotate');
      },
    },
    {
      icon: ExpandAltOutlined,
      title: '缩放',
      mode: 'scale',
      onClick: () => {
        setMode('scale');
        SceneManager.GizmoManager.setControlsMode('scale');
      },
    },
  ];
  useEffect(() => {
    EventSystem.subscribe(SceneEvents.ChangeSceneType, (type: SceneType) => {
      setSceneType(type);
    })
    return () => {
      EventSystem.unsubscribe(SceneEvents.ChangeSceneType);
    }
  }, []);
  return (
    <div className={`toolbar ${sceneType === SceneType.Edit ? 'toolbar-show ': 'toolbar-hide'}`}>
      {toolButtons.map((button) => {
        return (
          <div
            className={`toolbar-button ${button.mode == mode ? 'active' : '' }`}
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

export default React.memo(Toolbar);
