import React, {useCallback, useEffect} from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import remove from "../../../assets/images/reset.png"
import {getFormattedMessage} from "../../../shared/sharedMethod";

const ResetCartConfirmationModal = (props) => {
    const {onCancel, onConfirm, itemName} = props;

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            // User for Close the model on Escape
            onCancel(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);
        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, []);

    return (
        <SweetAlert
            custom
            confirmBtnBsStyle='danger mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnText={getFormattedMessage("reset.yes.title")}
            cancelBtnText={getFormattedMessage('delete-modal.no-btn')}
            title={getFormattedMessage("reset.title")}
            onConfirm={onConfirm}
            onCancel={onCancel}
            showCancel
            focusCancelBtn
            customIcon={remove}
        >
            <span className='sweet-text'>{getFormattedMessage("reset.modal.msg")} {itemName} ?</span>
        </SweetAlert>
    )
};
export default ResetCartConfirmationModal;
