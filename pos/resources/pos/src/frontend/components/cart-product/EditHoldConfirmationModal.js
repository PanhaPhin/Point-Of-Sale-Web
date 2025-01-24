import React, { useCallback, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getFormattedMessage } from "../../../shared/sharedMethod";

const EditHoldConfirmationModal = ( props ) => {
    const { onCancel, onConfirm, title, icon } = props;

    const escFunction = useCallback( ( event ) => {
        if ( event.keyCode === 27 ) {
            // User for Close the model on Escape
            onCancel( false );
        }
    }, [] );

    useEffect( () => {
        document.addEventListener( 'keydown', escFunction, false );
        return () => {
            document.removeEventListener( 'keydown', escFunction, false );
        };
    }, [] );

    return (
        <SweetAlert
            custom
            confirmBtnBsStyle='danger mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnText={getFormattedMessage( "create-modal.yes.ok-btn" )}
            cancelBtnText={getFormattedMessage( 'delete-modal.no-btn' )}
            title={title}
            onConfirm={onConfirm}
            onCancel={onCancel}
            showCancel
            focusConfirmBtn={false}
            focusCancelBtn={false}
            customIcon={icon}
        >
        </SweetAlert>
    )
};
export default EditHoldConfirmationModal;
