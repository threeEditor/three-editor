import { ModelAniUpdate } from '@/common/constant';
import './index.less';
import Card from "@/components/card";
import { debounce, toFix } from "@/edit/utils/func";
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

const Vec3 = ({ vec3, title }: {vec3?: any, title: string}) =>{
    return (vec3 ?  <div>
    <span className='propertyTitle'>{title}</span>
    <Input className='input' type="text" value={toFix(vec3.x || 0)} />
    <Input className='input' type="text" value={toFix(vec3.y || 0)} />
    <Input className='input' type="text" value={toFix(vec3.z || 0)} />
    </div> : null)
}

const PropertyPanel = (props: IPanelProps) => {
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
                        <Vec3 vec3={props.position} title={'position'}/>
                        <Vec3 vec3={props.rotation} title={'rotation'}/>
                        <Vec3 vec3={props.scale} title={'scale'}/>
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
                                    console.log('model select', v, props)
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