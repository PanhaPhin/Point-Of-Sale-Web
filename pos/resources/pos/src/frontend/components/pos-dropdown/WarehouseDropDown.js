import React, {useEffect} from 'react';
import {InputGroup} from 'react-bootstrap-v5';
import Select from 'react-select';
import {connect} from 'react-redux';
import {fetchAllWarehouses} from '../../../store/action/warehouseAction';
import { getFormattedMessage } from '../../../shared/sharedMethod';

const WarehouseDropDown = (props) => {
    const {setSelectedOption, selectedOption, warehouses, fetchAllWarehouses} = props;

    const warehouseOption = warehouses && warehouses.map((warehouse) => {
        return {value: warehouse.id, label: warehouse.attributes.name}
    });

    useEffect(() => {
        fetchAllWarehouses();
    },[]);

    const onChangeWarehouse = (obj) => {
        setSelectedOption(obj);
    };

    return (
        <div className='select-box col-6 ps-sm-2 position-relative'>
            <InputGroup>
                <InputGroup.Text id='basic-addon1' className='bg-transparent position-absolute border-0 z-index-1 input-group-text py-4 px-3'>
                    <i className="bi bi-house fs-3 text-gray-900" />
                </InputGroup.Text>
                <Select
                    placeholder='Choose Warehouse'
                    defaultValue={selectedOption}
                    value={selectedOption}
                    onChange={onChangeWarehouse}
                    options={warehouseOption}
                    noOptionsMessage={() => getFormattedMessage('no-option.label')}
                />
            </InputGroup>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {warehouses} = state;
    return {warehouses}
};
export default connect(mapStateToProps, {fetchAllWarehouses})(WarehouseDropDown);
