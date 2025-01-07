import { SceneSkyModeUpdate } from "@/common/constant";
import { defaultCubeMap } from "@/common/resource";
import { EventSystem } from "@/utils/event/EventSystem";
import { Card, Checkbox, ColorPicker } from "antd"
import { useEffect, useState } from "react"

export enum SkyMode {
    Pure = 'Pure',
    CubeMap = 'CubeMap',
}

export const SkyCard = () => {
    const [mode, setMode] = useState<SkyMode | null>(SkyMode.Pure);
    const [pure, setPure] = useState<string>('#000000');
    const [cube, setCube] = useState<string[]>(defaultCubeMap);
    useEffect(() => {
        if(mode === SkyMode.Pure) {
            EventSystem.broadcast(SceneSkyModeUpdate, {
                mode,
                params: pure,
            });
        } else {
            EventSystem.broadcast(SceneSkyModeUpdate, {
                mode,
                params: cube,
            });
        }
       
    }, [mode, pure, cube])
    return <Card>
    <div>天空背景色</div>
    <div>
    <Checkbox 
        checked={mode===SkyMode.Pure}
        onChange={(v) => {
            setMode(v.target.checked ? SkyMode.Pure : null);
        }}
    >Pure</Checkbox>
    <Checkbox 
        checked={mode===SkyMode.CubeMap}
        onChange={(v) => {
            setMode(v.target.checked ? SkyMode.CubeMap : null);
    }}
    >
        Cube</Checkbox>
    </div>
   {
    mode === SkyMode.Pure && <div>
        <ColorPicker defaultValue={pure} showText onChange={(color) => setPure(color.toHexString())} />
    </div>
   }
    
  </Card>
}