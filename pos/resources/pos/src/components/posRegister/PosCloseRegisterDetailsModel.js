import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { currencySymbolHendling, getFormattedMessage, numValidate, placeholderText } from '../../shared/sharedMethod';

const PosCloseRegisterDetailsModel = ( { showCloseDetailsModal, handleCloseRegisterDetails, setShowCloseDetailsModal } ) => {

    const { frontSetting, allConfigData, closeRegisterDetails } = useSelector( state => state )
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const [ formValue, setFormsValue ] = useState( {
        cash_in_hand_while_closing: 0,
        notes: ""
    } )

    useEffect( () => {
        if ( closeRegisterDetails ) {
            setFormsValue( data => ( {
                ...data,
                cash_in_hand_while_closing: closeRegisterDetails ? closeRegisterDetails?.total_cash_amount?.toFixed( 2 ) : 0
            } ) )
        }
    }, [ closeRegisterDetails ] )

    const onChangeInput = ( e ) => {
        setFormsValue( data => ( {
            ...data,
            [ e.target.name ]: e.target.value
        } ) )
    }

    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="example-custom-modal-styling-title"
                show={showCloseDetailsModal}
                onHide={() => setShowCloseDetailsModal( false )}
                className='registerModel-content'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {getFormattedMessage( "globally.close-register.title" )} ({moment( Date() ).format( 'MMMM Do YYYY' )})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive bordered hover className='mb-6 registerModel text-nowrap'>
                        <tbody>
                            <tr>
                                {/* <th>#</th> */}
                                <td>{getFormattedMessage( "select.payment-type.label" )}</td>
                                <td>{getFormattedMessage( "expense.input.amount.label" )}</td>
                            </tr>
                            <tr>
                                {/* <td>2</td> */}
                                <td>{getFormattedMessage( "globally.input.cash-in-hand.label" )}: </td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.cash_in_hand )}</td>
                            </tr>
                            <tr>
                                {/* <td>2</td> */}
                                <td>{getFormattedMessage( "cash.label" )}: </td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_cash_payment )}</td>
                            </tr>
                            <tr>
                                {/* <td>3</td> */}
                                <td>{getFormattedMessage( "payment-type.filter.cheque.label" )}: </td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_cheque_payment )}</td>
                            </tr>
                            <tr>
                                {/* <td>5</td> */}
                                <td>{getFormattedMessage( "payment-type.filter.bank-transfer.label" )}: </td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_bank_transfer_payment )}</td>
                            </tr>
                            <tr>
                                {/* <td>4</td> */}
                                <td>{getFormattedMessage( "payment-type.filter.other.label" )}: </td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_other_payment )}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table responsive bordered hover className='registerModel text-nowrap'>
                        <tbody>
                            <tr>
                                {/* <td>#</td> */}
                                <td>{getFormattedMessage( "register.total-sales.label" )}:</td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_amount )}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "register.total-refund.title" )}:</td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_return_amount )}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "register.total-payment.title" )}:</td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, closeRegisterDetails?.today_sales_payment_amount )}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className='row mt-5'>
                        <div className='col-md-6 mb-3'>
                            <label
                                className='form-label'>{getFormattedMessage( "globally.total-cash.label" )}: </label>
                            <span className='required' />
                            <input type='text' name='cash_in_hand_while_closing' autoComplete='off'
                                className='form-control' value={formValue.cash_in_hand_while_closing}
                                onKeyPress={( e ) => numValidate( e )}
                                onChange={( e ) => onChangeInput( e )} />
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label
                                className='form-label'>
                                {getFormattedMessage( "globally.input.note.label" )}:
                            </label>
                            {/* <span className='required' /> */}
                            <textarea type='text' rows="4" cols="50" name='notes' className='form-control'
                                placeholder={placeholderText( "globally.input.note.placeholder.label" )}
                                onChange={( e ) => onChangeInput( e )}
                                value={formValue.notes} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className='justify-content-end pt-2 pb-3'>
                    {/* <button className='btn btn-primary text-white'
                    onClick={printRegisterDetails}
                >{getFormattedMessage("print.title")}</button> */}
                    <button className='btn btn-secondary'
                        onClick={() => setShowCloseDetailsModal( false )}>{getFormattedMessage( "pos-close-btn.title" )}
                    </button>
                    <button className='btn btn-primary'
                        onClick={() => handleCloseRegisterDetails( formValue )}>{getFormattedMessage( "globally.close-register.title" )}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default PosCloseRegisterDetailsModel