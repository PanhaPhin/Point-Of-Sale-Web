import React, { useCallback, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import warning from "../../../assets/images/warning.png"
import { getFormattedMessage, placeholderText } from "../../../shared/sharedMethod";

const HoldCartConfirmationModal = ( props ) => {
    const { onCancel, onConfirm, onChangeInput } = props;

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
            title={getFormattedMessage( "create.hold-list.warning.message" )}
            onConfirm={onConfirm}
            onCancel={onCancel}
            showCancel
            focusConfirmBtn={false}
            focusCancelBtn={false}
            customIcon={warning}
        >
            <div className='sweet-text'>
                <input type='text' className='w-75 m-auto  p-2 form-control' onChange={onChangeInput} placeholder={placeholderText( "hold-list.reference-number.placeholder" )} />
            </div>
        </SweetAlert>
    )
};
export default HoldCartConfirmationModal;
