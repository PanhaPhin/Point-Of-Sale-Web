import React from 'react';
import {connect} from 'react-redux';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {useNavigate} from 'react-router-dom';
import {Filters} from '../../constants';
import CustomerForm from './CustomerForm';
import {addCustomer} from '../../store/action/customerAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateCustomer = (props) => {
    const {addCustomer} = props;
    const navigate = useNavigate();

    const addCustomerData = (formValue) => {
        addCustomer(formValue, navigate, Filters.OBJ);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('customer.create.title')} to='/app/customers'/>
            <CustomerForm addCustomerData={addCustomerData}/>
        </MasterLayout>
    )
};

export default connect(null, {addCustomer})(CreateCustomer);
