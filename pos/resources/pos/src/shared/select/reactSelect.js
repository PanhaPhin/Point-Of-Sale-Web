import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap-v5';
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";
import { getFormattedMessage } from '../sharedMethod';

const ReactSelect = ( props ) => {
    const { title, placeholder, data, defaultValue, onChange, errors, value, isRequired, multiLanguageOption, isWarehouseDisable, addSearchItems } = props;
    const dispatch = useDispatch();
    const isOptionDisabled = useSelector( ( state ) => state.isOptionDisabled );

    const option = data ? data?.map( ( da ) => {
        return {
            value: da.value ? da.value : da.id,
            label: da.label ? da.label : da.attributes.symbol ? da.attributes.symbol : da.attributes.name
        }
    } ) : multiLanguageOption?.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    useEffect( () => {
        addSearchItems ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    }, [] );

    return (
        <Form.Group className='form-group w-100' controlId='formBasic'>
            {title ? <Form.Label>{title} :</Form.Label> : ''}
            {isRequired ? '' : <span className='required' />}
            <Select
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                options={option}
                noOptionsMessage={() => getFormattedMessage( 'no-option.label' )}
                isDisabled={isWarehouseDisable ? isOptionDisabled : false}
            />
            {errors ? <span className='text-danger d-block fw-400 fs-small mt-2'>{errors ? errors : null}</span> : null}
        </Form.Group>
    )
};
export default ReactSelect;
