import React, {useState} from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {addBaseUnit} from '../../store/action/baseUnitsAction';
import BaseUnitsForm from './BaseUnitsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateBaseUnits = (props) => {
    const {addBaseUnit} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addUnitsData = (productValue) => {
        addBaseUnit(productValue);
    };

    return (
        <div className='text-end w-sm-auto'>
            <Button variant='primary mb-lg-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('base-unit.create.title')}
            </Button>
            <BaseUnitsForm addProductData={addUnitsData} handleClose={handleClose} show={show}
                       title={getFormattedMessage('base-unit.create.title')}/>
        </div>

    )
};

export default connect(null, {addBaseUnit})(CreateBaseUnits);
