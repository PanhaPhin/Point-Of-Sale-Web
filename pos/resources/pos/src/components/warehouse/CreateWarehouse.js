import React from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import {addWarehouse} from '../../store/action/warehouseAction';
import WarehouseForm from './WarehouseForm';
import HeaderTitle from '../header/HeaderTitle';
import {Filters} from '../../constants';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateWarehouse = (props) => {
    const {addWarehouse} = props;
    const navigate = useNavigate();

    const addWarehouseData = (formValue) => {
        addWarehouse(formValue, navigate, Filters.OBJ);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('warehouse.create.title')} to='/app/warehouse'/>
            <WarehouseForm addWarehouseData={addWarehouseData}/>
        </MasterLayout>
    )
};

export default connect(null, {addWarehouse})(CreateWarehouse);
