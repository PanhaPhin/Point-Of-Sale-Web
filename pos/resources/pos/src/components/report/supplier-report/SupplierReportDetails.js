import React, { useEffect, useState } from 'react';
import { Row, Tab, Tabs } from 'react-bootstrap';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import { useParams } from 'react-router-dom';
import PurchaseTab from "./supplier-tab/PurchaseTabs";
import PurchaseReturnTabs from "./supplier-tab/PurchaseReturnTabs";
import HeaderTitle from '../../header/HeaderTitle';
import { useDispatch, useSelector } from 'react-redux';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import Widget from "../../../shared/Widget/Widget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchSupplierReportWidget } from "../../../store/action/supplierReportWidgetAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";

const SupplierReportDetails = () => {
    const [ key, setKey ] = useState( 'purchase' );
    const { id } = useParams();
    const dispatch = useDispatch()
    const { supplierReportWidgetData, frontSetting, allConfigData } = useSelector( state => state )
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    useEffect( () => {
        id && dispatch( fetchSupplierReportWidget( id ) )
        dispatch( fetchFrontSetting() )
    }, [] )

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage( 'supplier.report.details.title' )} to='/app/report/suppliers' />
            <TabTitle title={placeholderText( 'supplier.report.details.title' )} />
            <Row className='g-4 justify-content-center'>
                <Widget title={getFormattedMessage( 'purchases.title' )}
                    className='bg-success' iconClass='bg-green-300'
                    icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white' />} currency={''}
                    value={supplierReportWidgetData?.purchases_count ? parseFloat( supplierReportWidgetData?.purchases_count ).toFixed( 2 ) : '0.00'} />
                <Widget title={getFormattedMessage( 'dashboard.purchaseReturn.title' )}
                    className='bg-warning' iconClass='bg-yellow-300'
                    icon={<FontAwesomeIcon icon={faArrowLeft} className='fs-1-xl text-white' />}
                    currency={''}
                    value={supplierReportWidgetData?.purchases_returns_count ? parseFloat( supplierReportWidgetData?.purchases_returns_count ).toFixed( 2 ) : '0.00'} />
                <Widget title={getFormattedMessage( 'purchases.total.amount.title' )}
                    className='bg-info' iconClass='bg-blue-300'
                    icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white' />}
                    currency={currencySymbol}
                    value={supplierReportWidgetData?.purchases_total_amount ? parseFloat( supplierReportWidgetData?.purchases_total_amount ).toFixed( 2 ) : '0.00'} />
                <Widget title={getFormattedMessage( 'purchases-return.total.amount.title' )}
                    className='bg-info' iconClass='bg-blue-300'
                    icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white' />}
                    currency={currencySymbol}
                    value={supplierReportWidgetData?.purchases_returns_total_amount ? parseFloat( supplierReportWidgetData?.purchases_returns_total_amount ).toFixed( 2 ) : '0.00'} />
            </Row>
            <Tabs defaultActiveKey='purchase' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
                className='mt-7 mb-5'>
                <Tab eventKey='purchase' title={getFormattedMessage( 'purchase.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'purchase' && <PurchaseTab allConfigData={allConfigData} id={id} />}
                    </div>
                </Tab>
                <Tab eventKey='purchase-return' title={getFormattedMessage( 'purchases.return.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'purchase-return' && <PurchaseReturnTabs allConfigData={allConfigData} id={id} />}
                    </div>
                </Tab>
            </Tabs>
        </MasterLayout>
    )
}

export default SupplierReportDetails;
