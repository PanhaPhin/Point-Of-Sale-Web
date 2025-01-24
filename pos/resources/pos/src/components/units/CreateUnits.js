import React, {useState} from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {addUnit} from '../../store/action/unitsAction';
import UnitsForm from './UnitsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateUnits = (props) => {
    const {addUnit} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addUnitsData = (productValue) => {
        addUnit(productValue);
    };

    return (
        <div className='text-end w-sm-auto'>
            <Button variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('unit.create.title')}
            </Button>
            <UnitsForm addProductData={addUnitsData} handleClose={handleClose} show={show}
                       title={getFormattedMessage('unit.create.title')}/>
        </div>

    )
};

export default connect(null, {addUnit})(CreateUnits);
