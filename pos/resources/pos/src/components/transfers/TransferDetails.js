import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import { Table } from "reactstrap";
import { fetchTransferDetails } from "../../store/action/transferDetailsAction";
import { currencySymbolHendling, getFormattedDate, getFormattedMessage } from "../../shared/sharedMethod";

const TransferDetails = ( props ) => {
    const { onDetails, lgShow, setLgShow, fetchFrontSetting, frontSetting, transferDetails, fetchTransferDetails, allConfigData } = props;

    useEffect( () => {
        fetchFrontSetting()
    }, [] )

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    useEffect( () => {
        if ( onDetails !== null ) {
            fetchTransferDetails( onDetails )
        }
    }, [ onDetails ] )

    const onsetLgShow = () => {
        setLgShow( false )
    }

    return (
        <div>
            <Modal
                className='tranfer_model'
                size="lg"
                aria-labelledby="example-custom-modal-styling-title"
                show={lgShow}
                onHide={() => onsetLgShow()}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {getFormattedMessage( "transfer.details.title" )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Table bordered hover className="overflow-auto w-100">
                        <tbody>
                            <tr>
                                <td>{getFormattedMessage( "react-data-table.date.column.label" )}</td>
                                <td>{transferDetails && transferDetails.attributes && getFormattedDate( transferDetails.attributes.date, allConfigData )}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "globally.detail.reference" )}</td>
                                <td>{transferDetails && transferDetails.attributes && transferDetails.attributes.reference_code}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "transfer.from-warehouse.title" )}</td>
                                <td>{transferDetails?.attributes?.from_warehouse?.name}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "transfer.to-warehouse.title" )}</td>
                                <td>{transferDetails?.attributes?.to_warehouse?.name}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "globally.detail.grand.total" )}</td>
                                <td>{currencySymbolHendling( allConfigData, currencySymbol, transferDetails?.attributes?.grand_total )}</td>
                            </tr>
                            <tr>
                                <td>{getFormattedMessage( "globally.detail.status" )}</td>
                                <td>{transferDetails?.attributes?.status === 1 && "Completed" || transferDetails?.attributes?.status === 2 && "Sent" || transferDetails?.attributes?.status === 3 && "Pending"}</td>

                            </tr>
                        </tbody>
                    </Table>

                    <Table bordered hover className="overflow-auto">
                        <thead>
                            <tr>
                                <th>{getFormattedMessage( "pos-product.title" )}</th>
                                <th>{getFormattedMessage( "product.product-details.code-product.label" )}</th>
                                <th>{getFormattedMessage( "dashboard.stockAlert.quantity.label" )}</th>
                                <th>{getFormattedMessage( "pos-sub-total.title" )}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transferDetails && transferDetails.attributes && transferDetails.attributes?.transfer_items.map( ( item, index ) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.code}</td>
                                        <td>{item.quantity}</td>
                                        <td>{currencySymbolHendling( allConfigData, currencySymbol, item.sub_total )}</td>
                                    </tr>
                                )
                            } )}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    )
};


const mapStateToProps = ( state ) => {
    const { transferDetails, isLoading, frontSetting, allConfigData } = state;
    return { transferDetails, isLoading, frontSetting, allConfigData };
};

export default connect( mapStateToProps, { fetchFrontSetting, fetchTransferDetails } )( TransferDetails );

