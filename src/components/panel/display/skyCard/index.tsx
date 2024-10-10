import { SceneSkyModeUpdate } from "@/common/constant";
import { EventSystem } from "@/utils/event/EventSystem";
import { Card, Checkbox } from "antd"
import { useEffect, useState } from "react"

export enum SkyMode {
    Pure = 'Pure',
    CubeMap = 'CubeMap',
}

export const SkyCard = () => {
    const [mode, setMode] = useState<SkyMode | null>(SkyMode.Pure);
    useEffect(() => {
        EventSystem.broadcast(SceneSkyModeUpdate, mode);
    }, [mode])
    return <Card>
    <div>Sky Mode</div>
    <Checkbox 
    checked={mode===SkyMode.Pure}
    onChange={(v) => {
        setMode(v.target.checked ? SkyMode.Pure : null);
    }}
    >Pure Color</Checkbox>
    <Checkbox 
    checked={mode===SkyMode.CubeMap}
    onChange={(v) => {
        setMode(v.target.checked ? SkyMode.CubeMap : null);
    }}
    >
        Cube Map</Checkbox>
  </Card>
}