import { Input } from "antd";
import { toFix } from "@/edit/utils/func";

interface IV3 {
    vec3?: any, 
    title: string
    onChange: (x: number, y: number, z: number) => void;
}

export const Vec3 = ({ vec3, title, onChange }: IV3) =>{
    const v1 = Number(toFix(vec3[0] || 0));
    const v2 = Number(toFix(vec3[1] || 0));
    const v3 = Number(toFix(vec3[2] || 0));
    return (vec3 ?  <div className='cardItem'>
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