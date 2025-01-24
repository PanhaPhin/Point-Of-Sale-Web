import React, { useEffect, useState } from 'react'
import { getFormattedDate, getFormattedMessage } from '../../../shared/sharedMethod';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { fetchTodaySaleOverAllReport } from "../../../store/action/pos/posRegisterDetailsAction";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditHoldConfirmationModal from '../cart-product/EditHoldConfirmationModal';
import warning from "../../../assets/images/warning.png"
import deleteItems from "../../../assets/images/remove.png"
import { fetchHoldLists, fetchHoldList, deleteHoldItem } from '../../../store/action/pos/HoldListAction';

function HoldListModal ( props ) {
    const { holdShow, setHoldShow, allConfigData, fetchHoldLists, updateCart, holdListData, fetchHoldList, editholdListData,
        setUpdateProducts, setCartItemValue, setSelectedCustomerOption, setSelectedOption, deleteHoldItem, setUpdateHoldList, setHold_ref_no } = props;

    const [ isEditHold, setIsEditHold ] = useState( false )
    const [ isDeteleHold, setIsDeteleHold ] = useState( false )
    const [ editHoldId, seteditHoldId ] = useState( null )
    const [ getEditHold, setGetEditHold ] = useState( false )
    const [ isDeteleHoldId, setIsDeteleHoldId ] = useState( null )
    useEffect( () => {
        fetchTodaySaleOverAllReport()
        fetchHoldLists()
    }, [] );

    const onsetHoldShow = () => {
        setHoldShow( false )
    }

    const holdEditPaymentModel = ( id ) => {
        seteditHoldId( id )
        setIsEditHold( true )
    }
    const holdDeletePaymentModel = ( id ) => {
        setIsDeteleHoldId( id )
        setIsDeteleHold( true )
    }

    useEffect( () => {
        if ( getEditHold === true ) {
            getHoldData()
            setGetEditHold( false )
        }
    }, [ editholdListData ] )

    const onConfirm = () => {
        if ( isEditHold ) {
            setUpdateProducts( [] )
            fetchHoldList( editHoldId )
            setIsEditHold( false )
            setGetEditHold( true )
        } else {
            setIsDeteleHold( false )
            deleteHoldItem( isDeteleHoldId )
            setUpdateHoldList( true )
        }

    }

    const getHoldData = () => {
        const items = editholdListData?.attributes?.hold_items
        if ( items !== undefined ) {
            const arrat = items?.map( ( items ) => {
                const prepareArray = {
                    name: items.product.name,
                    code: items.product.code,
                    stock_alert: items.product.stock_alert,
                    product_id: items.product_id,
                    product_cost: Number( items.product.product_cost ),
                    product_price: Number( items.product.product_price ),
                    net_unit_cost: Number( items.product.product_price ),
                    tax_type: items.tax_type,
                    product_price: items.product.product_price,
                    tax_amount: items.tax_amount,
                    discount_type: items.discount_type,
                    discount_value: items.discount_value,
                    discount_amount: items.discount_amount,
                    product_unit: items.product.product_unit,
                    sale_unit: items.product.sale_unit,
                    quantity: items.quantity,
                    sub_total: items.sub_total,
                    id: items.product_id,
                    sale_id: 1,
                    tax_value: items.tax_value,
                    hold_item_id: ""
                }
                updateCart( prevSelected => [ ...prevSelected, prepareArray ] );
                return prepareArray
            } )
            setHold_ref_no( editholdListData?.attributes?.reference_code )
            setCartItemValue( {
                discount: editholdListData?.attributes?.discount === 0 ? 0 : editholdListData?.attributes?.discount,
                tax: editholdListData?.attributes?.tax_rate === 0 ? 0 : editholdListData?.attributes?.tax_rate,
                shipping: editholdListData?.attributes?.shipping === 0 ? 0 : editholdListData?.attributes?.shipping,
            } )
            setSelectedCustomerOption( {
                value: editholdListData?.attributes?.customer_id,
                label: editholdListData?.attributes?.customer_name
            } )
            setSelectedOption( {
                value: editholdListData?.attributes?.warehouse_id,
                label: editholdListData?.attributes?.warehouse_name
            } )
            onsetHoldShow()
        }
    }

    const onCancel = () => {
        setIsEditHold( false )
        setIsDeteleHold( false )
    }

    return (
        <>
            <div>
                <Modal
                    size="md"
                    aria-labelledby="example-custom-modal-styling-title"
                    show={holdShow}
                    onHide={() => onsetHoldShow()}
                    className='registerModel-content'
                >
                    <Modal.Header closeButton className='p-4'>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {getFormattedMessage( "hold-list.details.title" )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive bordered hover className='m-0 registerModel holdListModel'>
                            <tbody>
                                <tr>
                                    {/* <th>#</th> */}
                                    <th >{getFormattedMessage( 'hold-list-id.table.column.label' )}</th>
                                    <th >{getFormattedMessage( "react-data-table.date.column.label" )}</th>
                                    <th >{getFormattedMessage( "hold-list-ref-id.table.column.label" )}</th>
                                    <th colSpan={2}>{getFormattedMessage( "react-data-table.action.column.label" )}</th>
                                </tr>
                                {holdListData && holdListData.length <= 0 ?
                                    <td colSpan={4} className={"custom-text-center"}>{getFormattedMessage( "sale.product.table.no-data.label" )}</td> : ''
                                }
                                {holdListData && holdListData.length > 0 && holdListData.map( ( items, index ) => {
                                    return (
                                        <tr key={index}>
                                            <td>{items.id}</td>
                                            <td>{getFormattedDate( items.attributes.date, allConfigData && allConfigData )}</td>
                                            <td>{items.attributes.reference_code}</td>
                                            <td>
                                                <FontAwesomeIcon onClick={() => holdEditPaymentModel( items.id )} cursor={"pointer"} className={"me-3 edit"} icon={faPenToSquare} />
                                                <FontAwesomeIcon onClick={() => holdDeletePaymentModel( items.id )} cursor={"pointer"} className={"delete"} icon={faTrash} />
                                            </td>
                                        </tr>
                                    )
                                } )}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </div>
            {isEditHold && <EditHoldConfirmationModal onConfirm={onConfirm} onCancel={onCancel} icon={warning} title={getFormattedMessage( "confirm-modal.msg" )} itemName={getFormattedMessage( "globally.detail.product" )} />}
            {isDeteleHold && <EditHoldConfirmationModal onConfirm={onConfirm} onCancel={onCancel} icon={deleteItems} title={getFormattedMessage( "delete-modal.msg" )} itemName={getFormattedMessage( "globally.detail.product" )} />}
        </>
    )
}

const mapStateToProps = ( state ) => {
    const { allConfigData, holdListData, editholdListData } = state;
    return { allConfigData, holdListData, editholdListData }
};

export default connect( mapStateToProps, { fetchHoldLists, fetchHoldList, deleteHoldItem } )( HoldListModal );
