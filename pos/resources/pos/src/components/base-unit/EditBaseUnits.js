import React from 'react';
import {connect} from 'react-redux';
import BaseUnitsForm from './BaseUnitsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditBaseUnits = (props) => {
    const {handleClose, show, unit} = props;

    return (
        <>
            {unit &&
            <BaseUnitsForm handleClose={handleClose} show={show} singleUnit={unit}
                       title={getFormattedMessage('base-unit.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditBaseUnits);

