import React from 'react';
import {connect} from 'react-redux';
import {deletetransfer} from '../../store/action/transfersAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteTransfer = (props) => {
    const {deletetransfer, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deletetransfer(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick}
                                         name={getFormattedMessage('transfer.title')}/>}
        </div>
    )
};

export default connect(null, {deletetransfer})(DeleteTransfer);
