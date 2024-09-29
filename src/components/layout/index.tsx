
import './index.less';
import { useEffect } from 'react';
import { preventTouchMove, preventWheel } from '@/utils/event/dom';
import ViewPort from '../viewport';
const Layout = () => {
    // useEffect(() => {
    //     // 关闭页面的上拉 下拉
    //     window.addEventListener('wheel', preventWheel, { passive: false });
    //     window.addEventListener('touchmove', preventTouchMove)
    //     return () => {
    //         window.removeEventListener('wheel', preventWheel);
    //         window.removeEventListener('touchmove', preventTouchMove);
    //     }
    // })
    return (
        <div className="layout">
            <div className='panel display'></div>
            <div className='center'>
                <div className='panel viewport'>
                    <ViewPort />
                </div>
                <div className='panel assets'></div>
            </div>
            <div className='panel properties'></div>
        </div>
    )
}
export default Layout;