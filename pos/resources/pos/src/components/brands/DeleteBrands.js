import React from 'react';
import {connect} from 'react-redux';
import {deleteBrand} from '../../store/action/brandsAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteBrands = (props) => {
    const {deleteBrand, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deleteBrand(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} title='Delete Brand'
                                         name={getFormattedMessage('brand.title')}/>}
        </div>
    )
};

export default connect(null, {deleteBrand})(DeleteBrands);
