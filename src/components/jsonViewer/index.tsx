
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import './index.less';
import { useState } from 'react';

export const JsonViewer = () => {
    const [code, setCode] = useState('console.log("Hello, World!");');
    const onChange = (newValue: string) => {
        setCode(newValue);
    };   
    return (<div className="ace_edit_container">
        <AceEditor
        mode="javascript"
        theme="monokai"
        value={code}
        onChange={onChange}
        height="100%"
        width="100%"
        />
    </div>)
}