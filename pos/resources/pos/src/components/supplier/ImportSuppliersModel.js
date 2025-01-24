import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImportSupplierForm from './ImportSupplierForm';
import { addImportSupplier } from "../../store/action/supplierAction";
import { getFormattedMessage } from '../../shared/sharedMethod';

function ImportSuppliersModel ( props ) {
    const { handleClose, show } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addImportData = ( formValue ) => {
        dispatch( addImportSupplier( formValue, navigate ) );
    };

    return (
        <>
            <ImportSupplierForm addImportData={addImportData} handleClose={handleClose} show={show}
                title={getFormattedMessage('suppliers.import.title')} />
        </>
    )
};


export default ImportSuppliersModel
