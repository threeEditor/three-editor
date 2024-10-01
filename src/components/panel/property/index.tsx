import { BaseObject } from "@/edit/objects/baseObject";
import './index.less';
import Card from "@/components/card";

export enum ViewType {
    None = 'None',
    Node = 'Node',
    Asset = 'Asset',
}

interface IPanelProps {
    viewType: ViewType;
    node?: BaseObject
}

const PropertyPanel = (props: IPanelProps) => {
    return <div className='panel properties'>
        <div className="content">
            <p className={'title'}>属性面板</p>
            {
                props.viewType === ViewType.Node && 
                <>
                    <div>type: {props.node?.type}</div>
                    <div>name: {props.node?.name}</div>
                    <Card>
                        <div>position</div>
                        <div>x: {props.node?.position.x}</div>
                        <div>y: {props.node?.position.y}</div>
                        <div>z: {props.node?.position.z}</div>
                    </Card>
                    <Card>
                        <div>rotation</div>
                        <div>x: {props.node?.rotation.x}</div>
                        <div>y: {props.node?.rotation.y}</div>
                        <div>z: {props.node?.rotation.z}</div>
                    </Card>
                    <Card>
                        <div>scale</div>
                        <div>x: {props.node?.scale.x}</div>
                        <div>y: {props.node?.scale.y}</div>
                        <div>z: {props.node?.scale.z}</div>
                    </Card>
                </>
            }
        </div>
    </div>
}

export default PropertyPanel;