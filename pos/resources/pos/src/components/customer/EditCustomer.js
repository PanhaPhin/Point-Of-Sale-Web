import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchCustomer } from '../../store/action/customerAction';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import CustomerForm from './CustomerForm';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const EditCustomer = ( props ) => {
    const { fetchCustomer, customers } = props;
    const { id } = useParams();

    useEffect( () => {
        fetchCustomer( id );
    }, [] );

    const itemsValue = customers && customers.length === 1 && customers.map( customer => ( {
        name: customer.attributes.name,
        email: customer.attributes.email,
        phone: customer.attributes.phone,
        country: customer.attributes.country,
        city: customer.attributes.city,
        address: customer.attributes.address,
        dob: customer.attributes.dob,
        id: customer.id
    } ) );

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage( 'customer.edit.title' )} to='/app/customers' />
            {customers.length === 1 && <CustomerForm singleCustomer={itemsValue} id={id} />}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { customers } = state;
    return { customers }
};

export default connect( mapStateToProps, { fetchCustomer } )( EditCustomer );

