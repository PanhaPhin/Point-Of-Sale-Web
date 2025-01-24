import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap-v5';
import { currencySymbolHendling, getFormattedDate, getFormattedMessage, placeholderText } from '../sharedMethod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from "react-redux";
import EditPaymentModal from "../../components/sales/EditPaymentModal";
import { deleteSalePayment } from "../../store/action/salePaymentAction";
import { fetchConfig } from "../../store/action/configAction";

const ShowPayment = ( props ) => {
    const { onShowPaymentClick, isShowPaymentModel, allSalePayments, currencySymbol, setIsShowPaymentModel, createPaymentItem, allConfigData } = props;
    const [ isEditModalOpen, setIsEditModalOpen ] = useState( false )
    const [ editSaleItem, setEditSaleItem ] = useState( {} )
    const dispatch = useDispatch()

    useEffect( () => {
        fetchConfig()
    }, [] )

    const onEditClick = ( item ) => {
        setIsEditModalOpen( true )
        setEditSaleItem( item )
    }

    const closeModal = () => {
        setIsEditModalOpen( !isEditModalOpen )
        setIsShowPaymentModel( false )
    }

    const onDeletClick = ( paymentId ) => {
        dispatch( deleteSalePayment( paymentId ) )
    }

    return (
        <>
            <Modal
                show={isShowPaymentModel}
                onHide={onShowPaymentClick} size='lg' keyboard={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{getFormattedMessage( 'globally.show.payment.label' )}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>{getFormattedMessage( "react-data-table.date.column.label" )}</th>
                                <th className='ps-3'>{getFormattedMessage( "globally.detail.reference" )}</th>
                                <th className='ps-3'>{getFormattedMessage( 'expense.input.amount.label' )}</th>
                                <th className='ps-3'>{getFormattedMessage( 'pos-sale.detail.Paid-bt.title' )}</th>
                                <th>{getFormattedMessage( 'react-data-table.action.column.label' )}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSalePayments && allSalePayments.length !== 0 && allSalePayments.map( ( item ) => {
                                return (
                                    <tr className='align-middle'>
                                        <td>
                                            {getFormattedDate( item?.payment_date, allConfigData && allConfigData )}
                                        </td>
                                        <td>
                                            {item.reference ? item.reference : "N/A"}
                                        </td>
                                        <td>
                                            {currencySymbolHendling( allConfigData, currencySymbol, item.amount )}
                                        </td>
                                        <td>
                                            {item.payment_type === 1 && "Cash"}
                                            {item.payment_type === 2 && "Cheque"}
                                            {item.payment_type === 3 && "Bank Transfer"}
                                            {item.payment_type === 4 && "Other"}
                                        </td>
                                        <td>
                                            <Button type='button' title={placeholderText( "globally.edit.tooltip.label" )} variant='light' onClick={() => onEditClick( item )}
                                                className='text-success btn-sm me-1'>
                                                <FontAwesomeIcon icon={faPencil} />
                                            </Button>
                                            <Button type='button' title={placeholderText( "globally.delete.tooltip.label" )} variant='light'
                                                onClick={() => onDeletClick( item.id )}
                                                className='btn-sm text-danger'>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            } )}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
            <EditPaymentModal createPaymentItem={createPaymentItem} isEditModalOpen={isEditModalOpen} closeModal={closeModal} editSaleItem={editSaleItem} />
        </>
    );
}

export default ShowPayment;
