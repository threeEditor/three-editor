
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import './index.less';
import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import SceneManager from '@/edit/sceneManager/sceneManager';

interface IJsonViewerProps {
    onClose: () => void;
}

const formatJsonStr = (json: object) => {
    try {
        const formattedJson = JSON.stringify(json, null, 4);
      return formattedJson;
    } catch (error) {
      console.error('Invalid JSON:', error);
      return 'JSON Format Error!';
    }
  };

export const JsonViewer = (props: IJsonViewerProps) => {
    const [code, setCode] = useState('');
    useEffect(() => {
        // const mockJSON = {
        //     name: 'scene1',
        //     defaultScene: 0,
        //     scenes: [ 
        //         {
        //             name: 'scene1',
        //             cameras: [],
        //             lights: [],
        //             helpers: [],
        //             objects: [],
        //         }
        //     ]
        // };
        const json = formatJsonStr(SceneManager.config);
        // mock
        setCode(json);
    }, [])


    const onChange = (newValue: string) => {
        console.log(newValue)
        setCode(newValue);
    };   
    return (<div className="ace_edit_container">
        <div className='ace_nav_bar'>
            <div>Scene Config</div>
            <CloseOutlined className='ace_nav_bar_close' onClick={props.onClose} />
        </div>
        <AceEditor
        className='ace_code_container'
        // mode="javascript"
        mode="json"
        // theme="monokai"
        value={code}
        onChange={onChange}
        height="90%"
        width="100%"
        wrapEnabled={true} // 开启自动折行
        />
    </div>)
}