import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {deleteSale} from '../../store/action/salesAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteSale = (props) => {
    const {deleteSale, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteSaleClick = () => {
        deleteSale(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteSaleClick} name={getFormattedMessage('sale.title')}/>}
        </div>
    )
};

export default connect(null, {deleteSale})(DeleteSale);
