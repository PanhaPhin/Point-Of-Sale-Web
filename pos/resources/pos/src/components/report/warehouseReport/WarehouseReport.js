import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import ReactSelect from '../../../shared/select/reactSelect';
import { fetchAllWarehouses } from '../../../store/action/warehouseAction';
import Widget from '../../../shared/Widget/Widget';
import SaleReturnTab from './SaleReturnTab';
import SalesTab from './SalesTab';
import PurchaseReturnTab from './PurchaseReturnTab';
import ExpensesTab from './ExpensesTab';
import { fetchWarehouseReport } from '../../../store/action/warehouseReportAction';
import WarehouseQtyChart from './WarehouseQtyChart';
import { faArrowLeft, faArrowRight, faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const WarehouseReport = ( props ) => {
    const { warehouses, fetchAllWarehouses, fetchWarehouseReport, warehouseReportData, allConfigData } = props;
    const [ warehouseValue, setWarehouseValue ] = useState( { label: getFormattedMessage( "unit.filter.all.label" ), value: null } );
    const [ key, setKey ] = useState( 'sales' );

    useEffect( () => {
        fetchAllWarehouses();
    }, [] );

    useEffect( () => {
        fetchWarehouseReport( warehouseValue.value );
    }, [ warehouseValue ] );

    const onWarehouseChange = ( obj ) => {
        setWarehouseValue( obj );
    };

    const array = warehouses
    const newFirstElement = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
    const newArray = [ newFirstElement ].concat( array )

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'warehouse.reports.title' )} />
            <Col md={4} className='mx-auto mb-5 col-12'>
                {newArray &&
                    <ReactSelect data={newArray} onChange={onWarehouseChange} defaultValue={newArray[ 0 ] ? {
                        label: newArray[ 0 ].attributes.name,
                        value: newArray[ 0 ].id
                    } : ''}
                        title={getFormattedMessage( 'warehouse.title' )} errors={''} isRequired
                        placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />}
            </Col>
            <Row className='g-4'>
                <Widget title={getFormattedMessage( 'sales.title' )}
                    icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white' />}
                    currency={''} className='bg-primary' iconClass='bg-cyan-300'
                    value={warehouseReportData?.sale_count ? parseFloat( warehouseReportData?.sale_count ).toFixed( 2 ) : '0.00'} />

                <Widget title={getFormattedMessage( 'purchases.title' )}
                    className='bg-success' iconClass='bg-green-300'
                    icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white' />} currency={''}
                    value={warehouseReportData?.purchase_count ? parseFloat( warehouseReportData?.purchase_count ).toFixed( 2 ) : '0.00'} />

                <Widget title={getFormattedMessage( 'dashboard.salesReturn.title' )}
                    className='bg-info' iconClass='bg-blue-300'
                    icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white' />}
                    currency={''}
                    value={warehouseReportData?.sale_return_count ? parseFloat( warehouseReportData?.sale_return_count ).toFixed( 2 ) : '0.00'} />

                <Widget title={getFormattedMessage( 'dashboard.purchaseReturn.title' )}
                    className='bg-warning' iconClass='bg-yellow-300'
                    icon={<FontAwesomeIcon icon={faArrowLeft} className='fs-1-xl text-white' />}
                    currency={''}
                    value={warehouseReportData?.purchase_return_count ? parseFloat( warehouseReportData?.purchase_return_count ).toFixed( 2 ) : '0.00'} />
            </Row>
            <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
                className='mt-7 mb-5'>
                <Tab eventKey='sales' title={getFormattedMessage( 'sales.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sales' && <SalesTab allConfigData={allConfigData} warehouseValue={warehouseValue} />}
                    </div>
                </Tab>
                <Tab eventKey='sales-return' title={getFormattedMessage( 'sales-return.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sales-return' && <SaleReturnTab allConfigData={allConfigData} warehouseValue={warehouseValue} />}
                    </div>
                </Tab>
                <Tab eventKey='purchase-return' title={getFormattedMessage( 'purchases.return.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'purchase-return' && <PurchaseReturnTab allConfigData={allConfigData} warehouseValue={warehouseValue} />}
                    </div>
                </Tab>
                <Tab eventKey='expenses' title={getFormattedMessage( 'expenses.title' )}
                    tabClassName='position-relative mb-3'>
                    <div className='w-100 mx-auto'>
                        {key === 'expenses' && <ExpensesTab allConfigData={allConfigData} warehouseValue={warehouseValue} />}
                    </div>
                </Tab>
            </Tabs>
            {/*<Row className='mt-6'>*/}
            {/*    <Col md={6}>*/}
            {/*        <WarehouseQtyChart/>*/}
            {/*    </Col>*/}
            {/*    <Col md={6}>*/}
            {/*        <WarehouseQtyChart/>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { warehouses, warehouseReportData, allConfigData } = state;
    return { warehouses, warehouseReportData, allConfigData }
};

export default connect( mapStateToProps, { fetchAllWarehouses, fetchWarehouseReport } )( WarehouseReport );
