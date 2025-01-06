import { Modal } from "antd"
import React from "react";
import { useEffect, useState } from "react";

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
    return <Modal title="InputTextModal" open={isModalOpen} onOk={() => {
        handleOk(inputV);
    }} onCancel={handleCancel}>
        <input autoFocus type="text" value={inputV} onChange={(e) => {
            setInputV(e.target.value);
        }} />
</Modal>
})