import { useEffect } from "react";
import { preventTouchMove, preventWheel } from "./event/dom";

// 关闭页面的上拉、下拉滑动
export const usePreventScroll = () => {
    useEffect(() => {
        window.addEventListener('wheel', preventWheel, { passive: false });
        window.addEventListener('touchmove', preventTouchMove);
        return () => {
            window.removeEventListener('wheel', preventWheel);
            window.removeEventListener('touchmove', preventTouchMove);
        }
      }, [])
}