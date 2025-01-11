import { Input, Modal } from "antd"
import React from "react";
import { useEffect, useState } from "react";
import './index.less';

export interface IInputTextModalParams {
    isModalOpen: boolean;
    handleOk: (text: string) => void;
    handleCancel: () => void;
    value: string;
}

export const InputTextModal = React.memo(({ isModalOpen, handleOk, handleCancel, value }: IInputTextModalParams) => {    
    const [ inputV, setInputV ] = useState(value);
    useEffect(() => {
        setInputV(value);
    }, [value])
    return <Modal 
            wrapClassName="custom_modal"
            title="InputTextModal" 
            centered 
            open={isModalOpen}
            width={300}
            okText="确认"
            cancelText="取消"
            onOk={() => {
                handleOk(inputV);
            }} 
            onCancel={handleCancel}
        >
        <Input autoFocus type="text" value={inputV} onChange={(e) => {
            setInputV(e.target.value);
        }} />
    </Modal>
})