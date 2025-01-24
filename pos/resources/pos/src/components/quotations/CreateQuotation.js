import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import QuotationForm from './QuotationForm';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAllCustomer} from '../../store/action/customerAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {addQuotation} from '../../store/action/quotationAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const CreateQuotation = (props) => {
    const {customers, fetchAllCustomer, warehouses, fetchAllWarehouses, addQuotation} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCustomer();
        fetchAllWarehouses();
    }, []);

    const addQuoationData = (formValue) => {
        addQuotation(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage("create-quotation.title")} to='/app/quotations'/>
            <QuotationForm addQuoationData={addQuoationData} customers={customers} warehouses={warehouses}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {customers, warehouses, totalRecord} = state;
    return {customers, warehouses, totalRecord}
};

export default connect(mapStateToProps, {fetchAllCustomer, fetchAllWarehouses, addQuotation})(CreateQuotation);
