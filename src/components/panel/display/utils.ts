import { TreeDataNode } from "antd";

export function filterNode(gData: TreeDataNode[], key: string): null | TreeDataNode {
    let node: null | TreeDataNode = null;
    gData.forEach(n => {
        if(n.key === key) {
            return node = n;
        }
        if(n.children) {
            return filterNode(n.children, key);
        }
    })
    return node;
}

export function updateNodeName(gData: TreeDataNode[], key: string, name: string) {
    const nextData = [...gData];
    nextData.forEach(n => {
        if(n.key === key) {
            n.title = name;
            return;
        }
        if(n.children) {
            return updateNodeName(n.children, key, name);
        }
    })
    return nextData;
}