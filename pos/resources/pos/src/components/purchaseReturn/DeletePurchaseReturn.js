import React from 'react';
import {connect} from 'react-redux';
import {deletePurchaseReturn} from '../../store/action/purchaseReturnAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeletePurchaseReturn = (props) => {
    const {deletePurchaseReturn, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deletePurchaseReturn(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick}
                                         name={getFormattedMessage('purchases.return.title')}/>}
        </div>
    )
};

export default connect(null, {deletePurchaseReturn})(DeletePurchaseReturn);
