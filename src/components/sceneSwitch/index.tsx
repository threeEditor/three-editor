import React, { LegacyRef, useState } from 'react';
import { Carousel, Popover } from 'antd';
import './index.less';
import { CarouselRef } from 'antd/es/carousel';
import { SceneType, SceneTypeDesc } from '@/common/constant';

interface IProps {
  defaultSceneType?: SceneType;
}

export const SceneSwitch = React.memo((props: IProps) => {
  const { defaultSceneType = SceneType.Edit } = props;
  const [type, setType] = useState(defaultSceneType);
  /**
   * 目前只有编辑状态和运行时两种状态
   */
  const prefSceneType =
    defaultSceneType === SceneType.Edit ? SceneType.Display : SceneType.Edit;

  const carouselRef = React.createRef();
  const handlePrev = () => {
    (carouselRef.current as CarouselRef).prev();
    setType(defaultSceneType);
  };

  const handleNext = () => {
    (carouselRef.current as CarouselRef).next();
    setType(prefSceneType);
  };

  return (
    <Popover
      placement="right"
      content={
        <>{`点击切换${
            type === SceneType.Edit
            ? SceneTypeDesc[prefSceneType]
            : SceneTypeDesc[defaultSceneType]
        }`}</>
      }
    >
        {/* inert */}
      <div className='carouselWrap'>
        <Carousel ref={carouselRef as LegacyRef<CarouselRef>} dots={false}>
            {/* Carousel 需要嵌套一层 div */}
            <div>
                <div className='content'>{SceneTypeDesc[defaultSceneType]}</div>
            </div>
            <div>
                <div className='content'>{SceneTypeDesc[prefSceneType]}</div>
            </div>
            {/* aria-hidden 会报错 因此不用 Button */}
          {/* <Button className="switch_btn">
            {SceneTypeDesc[defaultSceneType]}
          </Button>
          <Button aria-hidden className="switch_btn">
            {SceneTypeDesc[prefSceneType]}
          </Button> */}
        </Carousel>
        <div className='coverBtn' onClick={() => type === defaultSceneType ? handleNext() : handlePrev()} />
      </div>
    </Popover>
  );
});
