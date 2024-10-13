import './index.less';
import Card from "@/components/card";
import { toFix } from "@/edit/utils/func";
import { Input } from 'antd';

export enum ViewType {
    None = 'None',
    Node = 'Node',
    Asset = 'Asset',
}

interface IPanelProps {
    viewType: ViewType;
    [key: string]: any;
}

const Vec3 = ({ vec3, title }: {vec3?: any, title: string}) =>{
    return (vec3 ?  <div>
    <span className='propertyTitle'>{title}</span>
    <Input className='input' type="text" value={toFix(vec3.x || 0)} />
    <Input className='input' type="text" value={toFix(vec3.y || 0)} />
    <Input className='input' type="text" value={toFix(vec3.z || 0)} />
    </div> : null)
}

const PropertyPanel = (props: IPanelProps) => {
    return <div className='panel properties'>
        <div className="content">
            <p className={'title'}>属性面板</p>
            {
                props.viewType === ViewType.Node && 
                <>
                    <div>type: {props.type}</div>
                    <div>name: {props.name}</div>
                    <Card>
                        <div className={'title'}>Transform</div>
                        <Vec3 vec3={props.position} title={'position'}/>
                        <Vec3 vec3={props.rotation} title={'rotation'}/>
                        <Vec3 vec3={props.scale} title={'scale'}/>
                    </Card>
                    {
                        props.isModel &&  <Card>
                            <div className={'title'}>Animation</div>
                        </Card>
                    }
                     {
                        props.isLight &&  <Card>
                            <div className={'title'}>Light</div>
                        </Card>
                    }
                   
                </>
            }
        </div>
    </div>
}

export default PropertyPanel;