import React from 'react';
import {connect} from 'react-redux';
import {deleteUnit} from '../../store/action/unitsAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteUnits = (props) => {
    const {deleteUnit, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deleteUnit(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('unit.title')}/>}
        </div>
    )
};

export default connect(null, {deleteUnit})(DeleteUnits);
