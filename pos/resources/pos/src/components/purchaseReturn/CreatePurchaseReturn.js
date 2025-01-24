import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../store/action/supplierAction';
import PurchaseReturnForm from './PurchaseReturnForm';
import {addPurchaseReturn} from '../../store/action/purchaseReturnAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreatePurchaseReturn = (props) => {
    const {addPurchaseReturn, warehouses, fetchAllWarehouses, fetchAllSuppliers, suppliers} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSuppliers();
    }, []);

    const addPurchaseReturnData = (formValue) => {
        addPurchaseReturn(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('purchase.return.create.title')} to='/app/purchase-return'/>
            <PurchaseReturnForm addPurchaseReturnData={addPurchaseReturnData} warehouses={warehouses}
                                suppliers={suppliers}/>
        </MasterLayout>
    );
}

const mapStateToProps = (state) => {
    const {warehouses, suppliers, totalRecord} = state;
    return {warehouses, suppliers, totalRecord}
};

export default connect(mapStateToProps, {
    addPurchaseReturn,
    fetchAllWarehouses,
    fetchAllSuppliers
})(CreatePurchaseReturn);
