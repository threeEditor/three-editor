
import AceEditor from 'react-ace';
import ace from 'ace-builds';
ace.config.set('basePath', 'node_modules/ace-builds/src-min-nomodule');
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import './index.less';
import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import SceneManager from '@/edit/sceneManager/sceneManager';
import { EventSystem } from '@/utils/event/EventSystem';
import { SystemEvents } from '@/common/constant';
import { formatJsonStr } from '@/utils/util';

export const JsonViewer = () => {
    const [code, setCode] = useState('');
    const [aceEdit, setAceEdit] = useState(false);

    useEffect(() => {
        const json = formatJsonStr(SceneManager.config);        
        // mock
        setCode(json);
    }, [])

    useEffect(() => {
        EventSystem.subscribe(SystemEvents.ViewAceEdit, () => setAceEdit(true));
        EventSystem.subscribe(SystemEvents.HideAceEdit, () => setAceEdit(false));
        return () => {
          EventSystem.unsubscribe(SystemEvents.ViewAceEdit);
          EventSystem.unsubscribe(SystemEvents.HideAceEdit);
        }
    }, [])
    if(!aceEdit) return null;

    const onChange = (newValue: string) => {
        setCode(newValue);
    };   
    return <div className="ace_edit_container">
        <div className='ace_nav_bar'>
            <div>Scene Config JSON</div>
            <CloseOutlined className='ace_nav_bar_close' onClick={() => {
                setAceEdit(false);
                EventSystem.broadcast(SystemEvents.HideAceEdit);
            }} />
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
    </div>
}