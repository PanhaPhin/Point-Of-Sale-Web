import React from 'react';
import {Dropdown} from 'react-bootstrap';
import {getFormattedMessage} from '../sharedMethod';
import {
    faEye, faFilePdf, faDollarSign, faTrash, faAngleDown, faCartShopping, faPenToSquare, faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { Permissions } from '../../constants';
import { useSelector } from 'react-redux';

const ActionDropDownButton = (props) => {
    const {
        goToEditProduct, item, onClickDeleteModel = true, goToDetailScreen, isViewIcon = false, isPdfIcon = false,isCreateSaleReturn,onCreateSaleReturnClick,
        isCreatePayment = false, onPdfClick, title, isPaymentShow = false, onShowPaymentClick, onCreatePaymentClick, onCreateSaleClick, isCreatesSales
    } = props;

    const {config} = useSelector(state => state)

    return (
        <Dropdown className='table-dropdown'>
            <Dropdown.Toggle id='dropdown-autoclose-true' className='text-primary hide-arrow bg-transparent border-0 p-0'>
                {/*{getFormattedMessage('react-data-table.action.column.label')}*/}
                <i className="fa-solid fa-ellipsis-vertical" />
                <FontAwesomeIcon icon={faEllipsisVertical} className="fs-1"/>
                {/*<FontAwesomeIcon icon={faAngleDown} className='ms-2 pt-1'/>*/}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {isViewIcon ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        goToDetailScreen(item.id)
                    }} eventKey='1' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faEye}
                                         className='me-2'/>{getFormattedMessage('globally.view.tooltip.label')} {title}
                    </Dropdown.Item> : null
                }
                {isPdfIcon ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        onPdfClick(item.id);
                    }} eventKey='2' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faFilePdf}
                                         className='me-2'/> {getFormattedMessage('globally.pdf.download.label')}
                    </Dropdown.Item> : null
                }
                {item.payment_status !== 2 && isPaymentShow  ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        onShowPaymentClick(item);
                    }} eventKey='5' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faDollarSign}
                                         className='me-2'/> {getFormattedMessage('globally.show.payment.label')}
                    </Dropdown.Item> : null
                }
                {isCreatePayment && item.payment_status !== 1 ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        onCreatePaymentClick(item);
                    }} eventKey='6' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faDollarSign}
                                         className='me-2'/>
                        {getFormattedMessage("create-payment-title")}
                    </Dropdown.Item> : null
                }
                {isCreatesSales && !item.is_sale_created  ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        onCreateSaleClick(item);
                    }} eventKey='6' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faCartShopping}
                                         className='me-2'/>
                        {getFormattedMessage("sale.create.title")}
                        {/*{getFormattedMessage('globally.show.payment.label')}*/}
                    </Dropdown.Item> : null
                }
                {config && config.includes(Permissions.MANAGE_SALE_RETURN) && isCreateSaleReturn  ?
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        onCreateSaleReturnClick(item);
                    }} eventKey='6' className='py-3 px-4 d-flex align-items-center fs-6'>
                        <FontAwesomeIcon icon={faCartShopping}
                                         className='me-2'/>
                        {item.is_return === 1 ? getFormattedMessage("sale-return.edit.title") : getFormattedMessage("sale-return.create.title")}
                        {/*{getFormattedMessage('globally.show.payment.label')}*/}
                    </Dropdown.Item> : null
                }
                {goToEditProduct && !item.is_sale_created && item.is_return !== 1 &&
                <Dropdown.Item onClick={(e) => {
                    e.stopPropagation();
                    goToEditProduct(item);
                }} eventKey='3' className='py-3 px-4 d-flex align-items-center fs-6'>
                    <FontAwesomeIcon icon={faPenToSquare}
                                     className='me-2'/>{getFormattedMessage('globally.edit.tooltip.label')} {title}
                </Dropdown.Item>}
                <Dropdown.Item onClick={(e) => {
                    e.stopPropagation();
                    onClickDeleteModel(item);
                }} eventKey='4' className='py-3 px-4 d-flex align-items-center fs-6'>
                    <FontAwesomeIcon icon={faTrash}
                                     className='me-2'/> {getFormattedMessage('globally.delete.tooltip.label')} {title}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ActionDropDownButton;
