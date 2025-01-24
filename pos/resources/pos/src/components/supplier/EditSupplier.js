import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom'
import {fetchSupplier} from '../../store/action/supplierAction';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import SupplierForm from './SupplierForm';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const EditSupplier = (props) => {
    const {fetchSupplier, suppliers} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchSupplier(id,true);
    }, []);

    const itemsValue = suppliers && suppliers.length === 1 && suppliers.map(supplier => ({
        name: supplier.attributes.name,
        email: supplier.attributes.email,
        phone: supplier.attributes.phone,
        country: supplier.attributes.country,
        city: supplier.attributes.city,
        address: supplier.attributes.address,
        id: supplier.id
    }));

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('supplier.edit.title')} to='/app/suppliers'/>
            {suppliers.length === 1 && <SupplierForm singleSupplier={itemsValue} id={id}/>}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {suppliers} = state;
    return {suppliers}
};

export default connect(mapStateToProps, {fetchSupplier})(EditSupplier);

