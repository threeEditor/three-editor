import React from "react";
import { Dropdown, MenuProps, TreeDataNode } from "antd";
import './index.less'

export interface TreeMenuEvent {
  type: string;
  nodeKey: string;
  content?: string;
}

export const titleRender = (nodeData: TreeDataNode, handleClick: (e: TreeMenuEvent) => void) => {
    const onClick: MenuProps['onClick'] = (event) => {
      const { key, domEvent } = event;
      const nodeKey = nodeData.key as string;
      domEvent.stopPropagation();
      switch(key) {
        case 'cube':
        case 'sphere':
          return handleClick({
            type: 'add',
            nodeKey,
            content: key,
          });
        case 'delete':
          return handleClick({
            type: 'delete',
            nodeKey,
          });
        case 'rename':
          return handleClick({
            type: 'rename',
            nodeKey,
          });
      }
    };
    const items: MenuProps['items'] = [
      {
        label: 'add node',
        key: 'add',
        children: [{
          key: 'cube',
          label: 'cube',
        },
        {
          key: 'sphere',
          label: 'sphere',
        },]
      },
      {
        label: 'delete node',
        key: 'delete',
      },
      {
        label: 'rename',
        key: 'rename',
      },
    ];
    const title = nodeData.title as React.ReactNode;
    return ( <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
      <span className="treeMenuTitle">{ title }</span>
    </Dropdown>);
  }