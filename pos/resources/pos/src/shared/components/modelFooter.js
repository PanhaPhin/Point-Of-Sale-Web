import React from 'react';
import { Modal } from 'react-bootstrap-v5';
import { Link } from 'react-router-dom';
import { getFormattedMessage, placeholderText } from "../sharedMethod";
import { useSelector } from "react-redux";

const ModelFooter = ( props ) => {
    const { onEditRecord, onSubmit, editDisabled, clearField, addDisabled, link, ref, modelhide, cancelNotShow } = props;
    const { isSaving } = useSelector( state => state )

    return (
        <>
            {
                link ? <div className='d-flex mt-5 justify-content-end'>
                    {onEditRecord ?
                        <button onClick={( event ) => onSubmit( event )} className='btn btn-primary me-3' type='submit'
                            disabled={editDisabled || isSaving} ref={ref}>
                            {isSaving ? placeholderText( "globally-saving-btn-label" ) : placeholderText( "globally.save-btn" )}
                        </button>
                        :
                        <button onClick={( event ) => onSubmit( event )} className='btn btn-primary me-3' type='submit'
                            disabled={addDisabled || isSaving} ref={ref}>
                            {isSaving ? placeholderText( "globally-saving-btn-label" ) : placeholderText( "globally.save-btn" )}
                        </button>
                    }
                    {modelhide ?
                        <Link to={link} onClick={() => modelhide( false )}
                            className='btn btn-secondary'>
                            {getFormattedMessage( "globally.cancel-btn" )}
                        </Link>
                        :
                        <Link to={link}
                            className='btn btn-secondary'>
                            {getFormattedMessage( "globally.cancel-btn" )}
                        </Link>
                    }
                </div> :
                    <Modal.Footer children='justify-content-start' className='pt-0'>
                        {onEditRecord ?
                            <button onClick={( event ) => onSubmit( event )} className='btn btn-primary me-2' type='submit'
                                disabled={editDisabled}>
                                {placeholderText( "globally.save-btn" )}
                            </button> :
                            <button onClick={( event ) => onSubmit( event )} className='btn btn-primary me-2' type='submit'
                                disabled={addDisabled}>
                                {placeholderText( "globally.save-btn" )}
                            </button>
                        }
                        {!cancelNotShow ? <button onClick={() => clearField( false )}
                            className='btn btn-secondary'>
                            {getFormattedMessage( "globally.cancel-btn" )}
                        </button> : null}

                    </Modal.Footer>
            }
        </>
    )
};
export default ModelFooter;
