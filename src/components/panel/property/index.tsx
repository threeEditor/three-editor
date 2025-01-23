import { ModelAniUpdate, SceneEvents } from '@/common/constant';
import './index.less';
import Card from "@/components/card";
import { EventSystem } from '@/utils/event/EventSystem';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { isNumber } from '@/utils/is';
import { Vec3 } from './vec3';
import { Layout } from '@/common/layout';
import { ResizeDragger } from '@/components/resizeDragger';
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

let DefaultPropertyWidth = Layout.PropertyPanelWidth;
const PropertyPanel = (props: IPanelProps) => {
    // Transform
    const [position, setPosition] = useState([0, 0, 0]);
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [scale, setScale] = useState([1, 1, 1]);
    const [target, setTarget] = useState([0, 0, 0]);
    const [up, setUp] = useState([0, 0, 0]);
    const [width, setWidth] = useState(DefaultPropertyWidth);
    useEffect(() => {
        if(props.viewType !== ViewType.Node) return;
        const {position, rotation, scale} = props;
        position && setPosition([position.x, position.y, position.z]);
        rotation && setRotation([rotation.x, rotation.y, rotation.z]);
        scale && setScale([scale.x, scale.y, scale.z]);
    }, [props.position, props.rotation, props.scale])

    // camera
    useEffect(() => {
        if(props.viewType !== ViewType.Node) return;
        const { target, up } = props;
        target && setTarget([target.x, target.y, target.z]);
        up && setUp([up.x, up.y, up.z]);
    }, [props.target, props.up])

    // Model Animation hook
    const [animation, setAnimation] = useState<string | null>(null);
    const [animationSpeed, setAnimationSeed] = useState<number>(1);
    useEffect(() => {
        if(props.animations && props.animations[0]) {
            setAnimation(props.animations[0]);
        }
        if(isNumber(props.animationSpeed)) {
            setAnimationSeed(props.animationSpeed);
        }

    }, [props.animations, props.animationSpeed]);

    return <div className='properties_panel properties' style={{
        width: width + 'px',
    }}>
        <ResizeDragger onDrag={(deltaX) => {
            DefaultPropertyWidth -= deltaX;
            setWidth(DefaultPropertyWidth);
        }} />
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
                                <span className='propertyTitle'>Current</span>
                                <Select className='customSelect' style={{ width: '164px' }} value={animation} onChange={(v) => {
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
                                <span className='propertyTitle'>Speed</span>
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
                            <div className='cardItem'>
                                <span className='propertyTitle'>Color:</span>
                                <Input className='input' style={{width: '100px'}} type="text" value={props.color} onChange={((e) => {                                    
                                    console.log(e);
                                })} />
                            </div>
                            <div className='cardItem'>
                                <span className='propertyTitle'>Intensity:</span>
                                <Input className='input' style={{width: '100px'}} type="text" value={props.intensity} onChange={((e) => {                                    
                                    console.log(e);
                                })} />
                            </div>
                        </Card>
                    }
                    {
                        props.isCamera && <Card>
                            <div className={'title'}>Camera</div>
                            <Vec3 vec3={target} title={'target'} onChange={(x, y, z) => {
                                setTarget([x, y, z]);
                                EventSystem.broadcast(SceneEvents.PropertyTransform, {
                                    ...props,
                                    type: 'target',
                                    value: [x, y, z],
                                });
                            }}/>
                            <Vec3 vec3={up} title={'up'} onChange={(x, y, z) => {
                                setUp([x, y, z]);
                                EventSystem.broadcast(SceneEvents.PropertyTransform, {
                                    ...props,
                                    type: 'up',
                                    value: [x, y, z],
                                });
                            }}/>
                        </Card>
                    }
                </>
            }
        </div>
    </div>
}

export default PropertyPanel;