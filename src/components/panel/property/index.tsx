import { ModelAniUpdate, SceneEvents } from '@/common/constant';
import './index.less';
import Card from "@/components/card";
import { toFix } from "@/edit/utils/func";
import { EventSystem } from '@/utils/event/EventSystem';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { isNumber } from '@/utils/is';
const { Option } = Select;

export enum ViewType {
    None = 'None',
    Node = 'Node',
    Asset = 'Asset',
}

interface IPanelProps {
    viewType: ViewType;
    [key: string]: any;
}

interface IV3 {
    vec3?: any, 
    title: string
    onChange: (x: number, y: number, z: number) => void;
}

const Vec3 = ({ vec3, title, onChange }: IV3) =>{
    const v1 = Number(toFix(vec3[0] || 0));
    const v2 = Number(toFix(vec3[1] || 0));
    const v3 = Number(toFix(vec3[2] || 0));
    return (vec3 ?  <div>
    <span className='propertyTitle'>{title}</span>
    <Input className='input' type="number" onChange={(v) => {
        onChange(Number(v.target.value), v2, v3);
    }} value={v1} />
    <Input className='input' type="number" onChange={(v) => {
        onChange(v1, Number(v.target.value), v3);
    }}  value={v2} />
    <Input className='input' type="number" onChange={(v) => {
        onChange(v1, v2, Number(v.target.value));
    }}  value={v3} />
    </div> : null)
}

const PropertyPanel = (props: IPanelProps) => {
    // Transform
    const [position, setPosition] = useState([0, 0, 0]);
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [scale, setScale] = useState([1, 1, 1]);
    useEffect(() => {
        if(props.viewType !== ViewType.Node) return;
        const {position, rotation, scale} = props;
        setPosition([position.x, position.y, position.z]);
        setRotation([rotation.x, rotation.y, rotation.z]);
        setScale([scale.x, scale.y, scale.z]);
    }, [props.position, props.rotation, props.scale])

    // Model Animation hook
    const [animation, setAnimation] = useState<string | null>(null);
    const [animationSpeed, setAnimationSeed] = useState<number>(1);
    useEffect(() => {
        if(props.animations && props.animations[0]) {
            setAnimation(props.animations[0]);
        }
        if(isNumber(props.animationSpeed)) {
            setAnimationSeed(props.animationSpeed)
        }
    }, [props.animations, props.animationSpeed]);


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
                        <Vec3 vec3={position} title={'position'} onChange={(x, y, z) => {
                            setPosition([x, y, z]);
                            EventSystem.broadcast(SceneEvents.PropertyTransform, {
                                ...props,
                                type: 'position',
                                value: [x, y, z],
                            });
                        }}/>
                        <Vec3 vec3={rotation} title={'rotation'} onChange={(x, y, z) => {
                            setRotation([x, y, z]);
                            EventSystem.broadcast(SceneEvents.PropertyTransform, {
                                ...props,
                                type: 'rotation',
                                value: [x, y, z],
                            });
                        }}/>
                        <Vec3 vec3={scale} title={'scale'} onChange={(x, y, z) => {
                            setScale([x, y, z]);
                            EventSystem.broadcast(SceneEvents.PropertyTransform, {
                                ...props,
                                type: 'scale',
                                value: [x, y, z],
                            });
                        }}/>
                    </Card>
                    {
                        props.isModel &&  <Card>
                            <div className='title'>Animation</div>
                            <div className='cardItem'>
                                <span className='propertyTitle'>Cur Ani:</span>
                                <Select style={{width: '164px'}} value={animation} onChange={(v) => {
                                    setAnimation(v);
                                    EventSystem.broadcast(ModelAniUpdate.UpdateAni, {
                                        ...props,
                                        ani: v,
                                    })
                                }}>
                                {props.animations.map((ani: string) => (
                                    <Option key={ani} value={ani}>
                                    {ani}
                                    </Option>
                                ))}
                                </Select>
                            </div>
                            <div className='cardItem'>
                                <span className='propertyTitle'>Ani Speed:</span>
                                <Input className='input' style={{width: '100px'}} type="number" value={animationSpeed} onChange={((e) => {                                    
                                    const speed = Number(e.target.value);
                                    setAnimationSeed(speed);
                                    EventSystem.broadcast(ModelAniUpdate.UpdateAniSpeed, {
                                        ...props,
                                        animationSpeed: speed,
                                    })
                                })} />
                            </div>
                            
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