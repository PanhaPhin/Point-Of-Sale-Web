import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { deleteAdjustment } from '../../store/action/adjustMentAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteSale = (props) => {
    const {deleteAdjustment, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteAdjustMentClick = () => {
        deleteAdjustment(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteAdjustMentClick} name={getFormattedMessage('adjustments.title')}/>}
        </div>
    )
};

export default connect(null, {deleteAdjustment})(DeleteSale);
