import React from 'react';
import {connect} from 'react-redux';
import UnitsForm from './UnitsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditUnits = (props) => {
    const {handleClose, show, unit} = props;

    return (
        <>
            {unit &&
            <UnitsForm handleClose={handleClose} show={show} singleUnit={unit}
                       title={getFormattedMessage('unit.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditUnits);

