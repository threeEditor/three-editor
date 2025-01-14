import { useEffect, useState } from 'react';
import './index.less';


interface IResizeDragger {
    onDrag?: (deltaX: number, deltaY: number) => void;
}

let startX: number | null = null;
let startY: number | null = null;
export const ResizeDragger = (props: IResizeDragger) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleMouseUp = () => {
        setIsDragging(false);
        startX = null;
        startY = null;
        document.removeEventListener('mouseup', handleMouseUp);
    }
    const handleMouseMove = (e: MouseEvent) => {
        if(!isDragging) return;
        if(!startX) startX = e.clientX;
        if(!startY) startY = e.clientY;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        props.onDrag && props.onDrag(deltaX, deltaY);
        startX = e.clientX;
        startY = e.clientY;
    }

    useEffect(() => {
        if(isDragging) {
            console.log('isDragging');
            document.addEventListener('mousemove', handleMouseMove);
        } else {
            console.log('not dragging');
            document.removeEventListener('mousemove', handleMouseMove);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isDragging])

    return <div className='dragger' 
    onMouseDown={() => {
        setIsDragging(true);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
    }}
    />
}
