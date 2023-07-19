import React from 'react'
import { Modal } from "antd";

function Popup({ popup, handlePopup, children, onOk }) {
    const ClosePopup = () => {
        handlePopup(false)

    }
    return (
        <Modal
            title={null}
            // centered
            open={popup}
            style={{ top: 50 }}
            // footer={null}
            // width={800}
            onOk={() => { onOk?.() }}
            onCancel={() => {
                ClosePopup()
            }}
        >
            {children}
        </Modal>
    )
}

export default Popup