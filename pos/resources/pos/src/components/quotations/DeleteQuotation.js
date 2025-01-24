import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { deleteQuotation } from '../../store/action/quotationAction';

const DeleteQuotation = (props) => {
    const {onDelete, deleteModel, onClickDeleteModel, deleteQuotation} = props;

    const deleteSaleClick = () => {
        deleteQuotation(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteSaleClick} name={getFormattedMessage("quotation.title")}/>}
        </div>
    )
};

export default connect(null, {deleteQuotation})(DeleteQuotation);
