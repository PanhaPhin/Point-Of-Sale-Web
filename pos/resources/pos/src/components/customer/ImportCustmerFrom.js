import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { editBrand, fetchBrand, fetchBrands } from '../../store/action/brandsAction';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { placeholderText } from '../../shared/sharedMethod';
import { addToast } from '../../store/action/toastAction';

const ImportCustmerFrom = ( props ) => {
    const { handleClose, show, title, addImportData } = props;
    const [ formValue, setFormValue ] = useState( {
        file: ''
    } );
    const [ errors, setErrors ] = useState( { name: '' } );
    const [ selectFile, setSelectFile ] = useState( null );
    const dispatch = useDispatch()

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !formValue[ 'file' ] ) {
            errorss[ 'file' ] = getFormattedMessage( "globally.file.validate.label" );
        } else if ( formValue[ 'file' ].type !== "text/csv" ) {
            errorss[ 'file' ] = getFormattedMessage( "globally.csv-file.validate.label" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const handleImageChanges = ( e ) => {
        e.preventDefault();
        if ( e.target.files.length > 0 ) {
            const file = e.target.files[ 0 ];
            setSelectFile( file );
            if ( file.type === 'text/csv' ) {
                const fileReader = new FileReader();

                fileReader.readAsDataURL( file );
                dispatch( addToast( { text: getFormattedMessage( "file.success.upload.message" ) } ) );
                setErrors( '' );
            }
        }
    };

    const handleClick = event => {
        const { target = {} } = event || {};
        target.value = '';
    };

    const prepareFormData = ( data ) => {
        const formData = new FormData();
        if ( selectFile ) {
            formData.append( 'file', data.file );
        }
        return formData;
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        formValue.file = selectFile;
        const valid = handleValidation();
        if ( valid ) {
            setFormValue( formValue );
            addImportData( prepareFormData( formValue ) );
            clearField( false );
        }
        setSelectFile( null );
    };

    const clearField = () => {
        setFormValue( {
            file: ''
        } )
        setErrors( '' );
        handleClose( false );
    };

    return (
        <Modal show={show}
            onHide={clearField}
            keyboard={true}
        >
            <Form>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-12 mb-5'>
                            <Form.Group controlId='formFileMultiple' className='mb-3'>
                                <Form.Control type='file' onClick={handleClick}
                                    className='upload-input-file' onChange={handleImageChanges}
                                />
                                <span className='text-danger d-block fw-400 fs-small mt-2'>
                                    {errors[ 'file' ] ? errors[ 'file' ] : null}
                                </span>
                            </Form.Group>
                        </div>
                        <div className="col-sm-12 col-md-6 mb-1">
                            <button onClick={( event ) => onSubmit( event )} className='btn btn-primary me-2 fw-semibold w-100 h-100' type='submit'>
                                <small>{placeholderText( "globally.save-btn" )}</small>
                            </button>
                        </div>
                        <div className="col-sm-12 col-md-6 mb-1">
                            <a href='/import_demo_files/import_customers.csv' className='btn btn-info me-2 fw-semibold w-100 h-100' type='submit'>
                                <u><small>{getFormattedMessage( 'globally.sample.download.label' )}</small></u>
                            </a>
                        </div>
                        <div className='col-md-12'>
                            <table className="table table-bordered table-sm mt-4">
                                <tbody className='fw-normal'>
                                    <tr>
                                        <td>{getFormattedMessage( "supplier.table.name.column.title" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>{getFormattedMessage( "pos-sale.detail.Phone.info" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>{getFormattedMessage( "user.input.email.label" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>{getFormattedMessage( "globally.input.country.label" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>{getFormattedMessage( "globally.input.city.label" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                    <tr>
                                        <td>{getFormattedMessage( "globally.input.address.label" )}</td>
                                        <td><span className='badge bg-light-primary'><span>{getFormattedMessage( "globally.require-input.validate.label" )}</span></span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='col-md-12 text-end'>
                            <button onClick={() => clearField( false )}
                                className='btn btn-secondary'>
                                {getFormattedMessage( "globally.cancel-btn" )}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
};

export default connect( null, { fetchBrand, editBrand, fetchBrands } )( ImportCustmerFrom );
