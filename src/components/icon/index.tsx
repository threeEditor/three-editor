import './index.less';

interface IIconProps {
    src: string;
}

export const Icon = (iconProps: IIconProps) => {
    return <img className="icon" src={iconProps.src}></img>
}