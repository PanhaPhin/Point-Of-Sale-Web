import React from 'react';
import {connect} from 'react-redux';
import {deleteProductCategory} from '../../store/action/productCategoryAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteProductCategory = (props) => {
    const {deleteProductCategory, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deleteProductCategory(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('product-category.title')}/>
            }
        </div>
    )
};

export default connect(null, {deleteProductCategory})(DeleteProductCategory);
