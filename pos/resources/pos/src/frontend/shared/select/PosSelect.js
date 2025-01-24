import React, { useEffect } from 'react';
import { InputGroup } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { fetchAllCustomer } from '../../../store/action/customerAction';
import AsyncSelect from "react-select/async";

const PosSelect = ( props ) => {
    const { setSelectedCustomerOption, selectedCustomerOption, fetchAllCustomer, customers } = props;

    useEffect( () => {
        fetchAllCustomer();
        setOptionList( customers )
    }, [] );

    const onChangeWarehouse = ( obj ) => {
        setSelectedCustomerOption( obj );
    };

    return (
        <div className='select-box col-6 pe-sm-1 position-relative'>
            <InputGroup >
                <InputGroup.Text id='basic-addon1' className='bg-transparent position-absolute border-0 z-index-1 input-group-text py-4 px-3'>
                    <i className="bi bi-person fs-2 text-gray-900" />
                </InputGroup.Text>
                <AsyncSelect
                    cacheOptions
                    placeholder='Choose Customer'
                    defaultValue={selectedCustomerOption}
                    value={selectedCustomerOption}
                    onChange={onChangeWarehouse}
                    options={customerOption}
                />
            </InputGroup>
        </div>
    )
};

const mapStateToProps = ( state ) => {
    const { customers } = state;
    return { customers }
};
export default connect( mapStateToProps, { fetchAllCustomer } )( PosSelect );
