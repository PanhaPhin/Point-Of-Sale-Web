import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faPenToSquare, faTrash} from '@fortawesome/free-solid-svg-icons';
import {placeholderText} from '../sharedMethod';

const ActionButton = (props) => {
    const {goToEditProduct, item, onClickDeleteModel = true, isDeleteMode = true, isEditMode = true, goToDetailScreen, isViewIcon = false} = props;
    return (
        <>
            {isViewIcon ?
                <button title={placeholderText('globally.view.tooltip.label')}
                        className='btn text-success px-2 fs-3 ps-0 border-0'
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetailScreen(item.id)
                        }}>
                    <FontAwesomeIcon icon={faEye}/>
                </button> : null
            }
            {item.name === 'admin' || item.email === 'admin@infy-pos.com' || isEditMode === false ? null :
                <button title={placeholderText('globally.edit.tooltip.label')}
                        className='btn text-primary fs-3 border-0 px-xxl-2 px-1'
                        onClick={(e) => {
                            e.stopPropagation();
                            goToEditProduct(item);
                        }}
                >
                    <FontAwesomeIcon icon={faPenToSquare}/>
                </button>
            }
            {item.name === 'admin' || item.email === 'admin@infy-pos.com' || isDeleteMode === false ? null :
                <button title={placeholderText('globally.delete.tooltip.label')}
                        className='btn px-2 pe-0 text-danger fs-3 border-0'
                        onClick={(e) => {
                            e.stopPropagation();
                            onClickDeleteModel(item);
                        }}
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
            }
        </>
    )
};
export default ActionButton;
