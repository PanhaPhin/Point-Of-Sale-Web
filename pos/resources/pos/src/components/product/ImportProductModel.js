import React from 'react'
import {getFormattedMessage} from '../../shared/sharedMethod';
import ImportProductFrom from './ImportProductFrom';
import {addImportProduct} from '../../store/action/productAction';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';

function ImportProductModel(props) {
    const {handleClose, show} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addImportData = (formValue) => {
        dispatch(addImportProduct(formValue, navigate));
    };

    return (
        <>
            <ImportProductFrom addImportData={addImportData} handleClose={handleClose} show={show}
                               title={getFormattedMessage('product.import.title')}/>
        </>
    )
};


export default ImportProductModel
