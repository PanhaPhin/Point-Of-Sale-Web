import React, { useState, createRef } from 'react';
import { connect } from 'react-redux';
import { Form, Modal } from 'react-bootstrap-v5';
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { editBaseUnit, fetchBaseUnits, fetchBaseUnit } from '../../store/action/baseUnitsAction';
import ModelFooter from '../../shared/components/modelFooter';

const BaseUnitsForm = ( props ) => {
    const { handleClose, show, title, addProductData, editBaseUnit, singleUnit } = props;
    const innerRef = createRef();

    const [ unitValue, setUnitValue ] = useState( {
        name: singleUnit ? singleUnit.name : ''
    } );
    const [ errors, setErrors ] = useState( {
        name: ''
    } );

    const disabled = singleUnit && singleUnit.name === unitValue.name.trim()

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !unitValue[ 'name' ].trim() ) {
            errorss[ 'name' ] = getFormattedMessage( "globally.input.name.validate.label" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onChangeInput = ( e ) => {
        e.preventDefault();
        setUnitValue( inputs => ( { ...inputs, [ e.target.name ]: e.target.value } ) )
        setErrors( '' );
    };

    const prepareFormData = ( data ) => {
        const params = new URLSearchParams();
        params.append( 'name', data.name );
        return params;
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( singleUnit && valid ) {
            if ( !disabled ) {
                editBaseUnit( singleUnit.id, prepareFormData( unitValue ), handleClose );
                clearField( false );
            }
        } else {
            if ( valid ) {
                setUnitValue( unitValue );
                addProductData( prepareFormData( unitValue ) );
                clearField( false );
            }
        }
    };

    const clearField = () => {
        setUnitValue( {
            name: '',
        } );
        setErrors( '' );
        handleClose( false );
    };

    return (
        <Modal show={show}
            onHide={clearField}
            keyboard={true}
            onShow={() => setTimeout( () => {
                innerRef.current.focus();
            }, 1 )}
        >
            <Form onKeyPress={( e ) => {
                if ( e.key === 'Enter' ) {
                    onSubmit( e )
                }
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-12 mb-3'>
                            <label
                                className='form-label'>{getFormattedMessage( "globally.input.name.label" )}: </label>
                            <span className='required' />
                            <input type='text' name='name' value={unitValue.name}
                                placeholder={placeholderText( "globally.input.name.placeholder.label" )}
                                className='form-control' ref={innerRef} autoComplete='off'
                                onChange={( e ) => onChangeInput( e )} />
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'name' ] ? errors[ 'name' ] : null}</span>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
            <ModelFooter onEditRecord={singleUnit} onSubmit={onSubmit} editDisabled={disabled}
                clearField={clearField} addDisabled={!unitValue.name.trim()} />
        </Modal>
    )
};

export default connect( null, { fetchBaseUnit, editBaseUnit, fetchBaseUnits } )( BaseUnitsForm );
