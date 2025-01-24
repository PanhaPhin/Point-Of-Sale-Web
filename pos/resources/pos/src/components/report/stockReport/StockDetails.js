import React, {useEffect, useState} from 'react';
import {Tab, Tabs} from 'react-bootstrap';
import MasterLayout from '../../MasterLayout';
import TabTitle from '../../../shared/tab-title/TabTitle';
import {getFormattedMessage, placeholderText} from '../../../shared/sharedMethod';
import SaleTabs from './stockDetails/SaleTabs';
import {useParams} from 'react-router-dom';
import SaleReturnTabs from './stockDetails/SaleReturnTabs';
import PurchaseTab from './stockDetails/PurchaseTabs';
import PurchaseReturnTabs from './stockDetails/PurchaseReturnTabs';
import HeaderTitle from '../../header/HeaderTitle';
import {connect} from 'react-redux';
import {stockDetailsWarehouseAction} from '../../../store/action/stockDetailsWarehouse';
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";

const StockDetails = (props) => {
    const {stockDetailsWarehouseAction, stockWarehouse, allConfigData} = props;
    const [key, setKey] = useState('sales');
    const {id} = useParams();

    useEffect(() => {
        stockDetailsWarehouseAction(id);
    }, []);

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('stock.report.details.title')} to='/app/report/report-stock'/>
            <TabTitle title={placeholderText('stock.report.details.title')}/>
            <div className='card'>
                <div className='m-auto mb-5 col-12 mt-5 text-center'>
                    <h3>{stockWarehouse[0] && stockWarehouse[0].product.name}</h3>
                </div>
                <div className='col-md-5 ms-5'>
                    <table className='table table-responsive'>
                        <thead>
                        <tr>
                            <th>
                                {getFormattedMessage('dashboard.stockAlert.warehouse.label')}
                            </th>
                            <th>
                                {getFormattedMessage('dashboard.stockAlert.quantity.label')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {stockWarehouse && stockWarehouse.map((warehouse, index) => {
                            return (
                                <tr key={index}>
                                    <td>{warehouse.warehouse.name}</td>
                                    <td>{(warehouse.quantity).toFixed(2)} {stockWarehouse[0] && stockWarehouse[0].product.product_unit === "1" && "Pc" || stockWarehouse[0].product.product_unit === "2" && "M" || stockWarehouse[0].product.product_unit === "3" && "Kg"}</td>
                                </tr>
                            )
                        })}
                        {!stockWarehouse.length &&
                        <tr>
                            <td colSpan={5} className='fs-5 px-3 py-6 text-center'>
                                {getFormattedMessage('sale.product.table.no-data.label')}
                            </td>
                        </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
                <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={(k) => setKey(k)}
                      className='mt-7 mb-5'>
                    <Tab eventKey='sales' title={getFormattedMessage('sales.title')}
                         tabClassName='position-relative mb-3 me-7'>
                        <div className='w-100 mx-auto'>
                            {key === 'sales' && <SaleTabs allConfigData={allConfigData} id={id}/>}
                        </div>
                    </Tab>
                    <Tab eventKey='sales-return' title={getFormattedMessage('sales-return.title')}
                         tabClassName='position-relative mb-3 me-7'>
                        <div className='w-100 mx-auto'>
                            {key === 'sales-return' && <SaleReturnTabs allConfigData={allConfigData} id={id}/>}
                        </div>
                    </Tab>
                    <Tab eventKey='purchase' title={getFormattedMessage('purchase.title')}
                         tabClassName='position-relative mb-3 me-7'>
                        <div className='w-100 mx-auto'>
                            {key === 'purchase' && <PurchaseTab allConfigData={allConfigData} id={id}/>}
                        </div>
                    </Tab>
                    <Tab eventKey='purchase-return' title={getFormattedMessage('purchases.return.title')}
                         tabClassName='position-relative mb-3 me-7'>
                        <div className='w-100 mx-auto'>
                            {key === 'purchase-return' && <PurchaseReturnTabs allConfigData={allConfigData} id={id}/>}
                        </div>
                    </Tab>
                </Tabs>
        </MasterLayout>
    )
}
const mapStateToProps = (state) => {
    const {stockWarehouse, allConfigData} = state;
    return {stockWarehouse, allConfigData}
};

export default connect(mapStateToProps, {stockDetailsWarehouseAction})(StockDetails);
