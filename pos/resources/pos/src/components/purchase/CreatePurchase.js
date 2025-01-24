import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {useNavigate} from 'react-router-dom';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../store/action/supplierAction';
import PurchaseForm from './PurchaseForm';
import {addPurchase} from '../../store/action/purchaseAction';
import {getFormattedMessage} from "../../shared/sharedMethod";

const CreatePurchase = (props) => {
    const {addPurchase, warehouses, fetchAllWarehouses, fetchAllSuppliers, suppliers} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSuppliers();
    }, []);

    const addPurchaseData = (formValue) => {
        addPurchase(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage("purchase.create.title")} to='/app/purchases'/>
            <PurchaseForm addPurchaseData={addPurchaseData} warehouses={warehouses}
                          suppliers={suppliers}/>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {warehouses, suppliers, totalRecord} = state;
    return {warehouses, suppliers, totalRecord}
};

export default connect(mapStateToProps, {addPurchase, fetchAllWarehouses, fetchAllSuppliers})(CreatePurchase);
