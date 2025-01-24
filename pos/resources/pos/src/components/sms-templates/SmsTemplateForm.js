import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';
import 'react-quill/dist/quill.snow.css';
import { UpdateSmsTemplate } from "../../store/action/smsTemplatesAction";

const SmsTemplateForm = ( props ) => {
    const { id, singleSMSTemplate, UpdateSmsTemplate } = props;
    const navigate = useNavigate();

    const [ smsTemplateValue, setsmsTemplateValue ] = useState( {
        name: singleSMSTemplate ? singleSMSTemplate[ 0 ].name : '',
        content: singleSMSTemplate ? singleSMSTemplate[ 0 ].content : ''
    } );

    const [ errors, setErrors ] = useState( {
        name: '',
        content: ""
    } );

    const disabled = singleSMSTemplate && singleSMSTemplate[ 0 ].content === smsTemplateValue.content

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !smsTemplateValue[ 'name' ] ) {
            errorss[ 'name' ] = getFormattedMessage( 'globally.input.name.validate.label' );
        } else if ( !smsTemplateValue[ 'content' ] ) {
            errorss[ 'content' ] = getFormattedMessage( "sms-content.error.message" );
        } else if ( smsTemplateValue[ 'content' ].trim().length >= 300 ) {
            errorss[ 'content' ] = getFormattedMessage( "sms-content-text.error.message" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onChangeInput = ( e ) => {
        e.preventDefault();
        setsmsTemplateValue( inputs => ( { ...inputs, [ e.target.name ]: e.target.value } ) )
        setErrors( '' );
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( singleSMSTemplate && valid ) {
            if ( !disabled ) {
                UpdateSmsTemplate( id, smsTemplateValue, navigate );
            }
        }
    };

    return (
        <div className='card'>
            <div className='card-body'>
                <Form>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( 'globally.input.name.label' )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='name'
                                readOnly={true}
                                placeholder={placeholderText( 'globally.input.name.placeholder.label' )}
                                className='form-control disabled' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )}
                                value={smsTemplateValue.name} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'name' ] ? errors[ 'name' ] : null}</span>

                            <label className='form-label'>{getFormattedMessage( 'globally.input.content.label' )}: </label>
                            <textarea type='text' name='content' rows="5"
                                placeholder={placeholderText( 'globally.input.content.label' )}
                                className='form-control'
                                onChange={( e ) => onChangeInput( e )}
                                value={smsTemplateValue.content} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'content' ] ? errors[ 'content' ] : null}</span>

                        </div>
                        <div className='col-md-6 mb-3 '>
                            <div className="email-template-padding">
                                <label
                                    className='form-label text-decoration-underline'>{getFormattedMessage( 'sms-content-variables.title' )}
                                    : </label>
                                {/*<textarea name='content' className='form-control' rows='3'*/}
                                {/*          placeholder={placeholderText('globally.input.content.label')}*/}
                                {/*          onChange={(e) => onChangeInput(e)}*/}
                                {/*          value={smsTemplateValue.content || ''}/>*/}
                                <ul className="text-gray-600">
                                    <li>
                                        {`{customer_name}`}
                                    </li>
                                    <li>
                                        {`{sales_id}`}
                                    </li>
                                    <li>
                                        {`{sales_date}`}
                                    </li>
                                    <li>
                                        {`{sales_amount}`}
                                    </li>
                                    <li>
                                        {`{paid_amount}`}
                                    </li>
                                    <li>
                                        {`{due_amount}`}
                                    </li>
                                </ul>
                            </div>
                            {/* <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors['content'] ? errors['content'] : null}</span> */}
                        </div>
                        <ModelFooter onEditRecord={singleSMSTemplate} onSubmit={onSubmit} editDisabled={disabled}
                            link='/app/sms-templates' addDisabled={!smsTemplateValue.name} />
                    </div>
                </Form>
            </div>
        </div>
    )
};

export default connect( null, { UpdateSmsTemplate } )( SmsTemplateForm );
