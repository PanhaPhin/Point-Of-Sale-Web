import React from 'react';
import {connect} from 'react-redux';
import MasterLayout from '../MasterLayout';
import SupplierForm from './SupplierForm';
import HeaderTitle from '../header/HeaderTitle';
import {useNavigate} from 'react-router-dom';
import {Filters} from '../../constants';
import {addSupplier} from '../../store/action/supplierAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateSupplier = (props) => {
    const {addSupplier} = props;
    const navigate = useNavigate();

    const addSupplierData = (formValue) => {
        addSupplier(formValue, navigate, Filters.OBJ);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('supplier.create.title')} to='/app/suppliers'/>
            <SupplierForm addSupplierData={addSupplierData}/>
        </MasterLayout>
    )
};

export default connect(null, {addSupplier})(CreateSupplier);
