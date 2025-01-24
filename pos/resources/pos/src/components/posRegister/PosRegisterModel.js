import React, { useState } from 'react'
import { getFormattedMessage, numValidate } from '../../shared/sharedMethod';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { registerCashInHandAction } from '../../store/action/pos/posRegisterDetailsAction';
import { useNavigate } from 'react-router';

const PosRegisterModel = ( { showPosRegisterModel, onClickshowPosRegisterModel } ) => {

    const [ cashInHand, setCashInHand ] = useState( 0 )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = () => {
        dispatch( registerCashInHandAction( {
            cash_in_hand: cashInHand
        }, navigate ) )
        onClickshowPosRegisterModel()
    }

    const onChangeInput = ( e ) => {
        setCashInHand( e.target.value )
    }

    return (
        <>
            <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showPosRegisterModel}
                onHide={() => onClickshowPosRegisterModel()}
            >
                <Modal.Header closeButton className='py-4 pt-5'>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4>POS Register</h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-4'>
                    <div className='col-md-12'>
                        <label
                            className='form-label'>{getFormattedMessage( 'globally.input.cash-in-hand.label' )}: </label>
                        <input type='text' name='code' className=' form-control'
                            onChange={( e ) => onChangeInput( e )}
                            onKeyPress={( e ) => numValidate( e )}
                            value={cashInHand} />
                    </div>
                </Modal.Body>
                <Modal.Footer className='py-4 pb-5'>
                    <Button onClick={onSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default PosRegisterModel