import React from 'react';
import { connect } from 'react-redux';
import { deleteLanguage } from '../../store/action/languageAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';

const DeleteBaseUnits = ( props ) => {
    const { deleteLanguage, onDelete, deleteModel, onClickDeleteModel } = props;

    const deleteUserClick = () => {
        deleteLanguage( onDelete.id );
        onClickDeleteModel( false );
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteUserClick} name={"Language"} />}
        </div>
    )
};

export default connect( null, { deleteLanguage } )( DeleteBaseUnits );
