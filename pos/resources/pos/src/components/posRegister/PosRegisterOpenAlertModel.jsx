import React from 'react'
import { getFormattedMessage } from '../../shared/sharedMethod';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router';

const PosRegisterOpenAlertModel = ( { showROAlertModel, setShowROAlertModel } ) => {

    const navigate = useNavigate()

    return (
        <>
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showROAlertModel}
                onHide={() => setShowROAlertModel( false )}
            >
                <Modal.Header closeButton className='py-4 pt-5'>
                </Modal.Header>
                <Modal.Body className='py-4'>
                    <h3 className='text-center m-0'>
                        {getFormattedMessage( "register.is.still.open.message" )}
                        <br />
                        {getFormattedMessage( "Are.you.sure.you.want.to.go.to.dashboard.message" )}
                    </h3>
                </Modal.Body>
                <Modal.Footer className='py-4 pb-5 justify-content-center'>
                    <Button
                        className='px-11 py-3'
                        onClick={() => {
                            setShowROAlertModel( false )
                            navigate( "/app/dashboard" )
                        }}
                    >{getFormattedMessage('yes.modal.title')}</Button>
                    <Button variant='danger' className='px-11 py-3' onClick={() => setShowROAlertModel( false )}>{getFormattedMessage('no.modal.title')}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PosRegisterOpenAlertModel