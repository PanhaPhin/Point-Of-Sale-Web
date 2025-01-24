import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ModelFooter from '../../shared/components/modelFooter';
import MasterLayout from "../MasterLayout";
import { fetchSmsApiSetting, updateSmsApiSetting } from '../../store/action/SmsApiAction';
import TabTitle from "../../shared/tab-title/TabTitle";

const SmsApi = ( props ) => {
    const { smsApiData, fetchSmsApiSetting, updateSmsApiSetting } = props;
    const [ disabled, setDisabled ] = useState( true );

    useEffect( () => {
        fetchSmsApiSetting()
    }, [] )

    const [ smsValue, setSmsValue ] = useState( [ { key: "", value: "" } ] );
    const [ errors, setErrors ] = useState( smsValue.length !== 1 && smsValue );

    useEffect( () => {
        if ( smsApiData.attributes ) {
            setSmsValue( smsApiData.attributes )
        }
    }, [ smsApiData ] )

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        smsValue && smsValue.map( ( sms, i ) => {
            if ( !sms.key || !sms.value ) {
                errorss[ `${i}` ] = getFormattedMessage( "globally.require-input.validate.label" );
            } else {
                isValid = true;
            }
        } )

        setErrors( errorss );
        return isValid;
    };

    const prepareFormData = ( data ) => {
        const formValue = {
            sms_data: smsValue
        }
        return formValue;
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        const isValid = smsValue.length && smsValue.filter( ( sms ) => sms.value === "" )
        if ( !isValid.length ) {
            updateSmsApiSetting( prepareFormData( smsValue ) );
            setDisabled( true )
        }
    };

    const handleInputChange = ( e, index ) => {
        const { name, value } = e.target;
        const list = [ ...smsValue ];
        list[ index ][ name ] = value;
        setSmsValue( list );
        setDisabled( false )
    };

    const handleRemoveClick = index => {
        setDisabled( false )
        const list = [ ...smsValue ];
        list.splice( index, 1 );
        setSmsValue( list );
    };

    const handleAddClick = () => {
        setSmsValue( [ ...smsValue, { key: "", value: "" } ] );
        setDisabled( false )
    };

    return (
        <MasterLayout>
            <TabTitle title={placeholderText( 'sms-api.title' )} />
            <div className='card'>
                <div className='card-body'>
                    <div className="col-sm-12 sms_api mb-10">
                        <div className="rounded-10 sms-api-main">
                            <h1>HTTP/URL</h1>
                            <h6 className="mb-3">Note:</h6>
                            <h5>You can use any SMS APIs here, all you need to set up is :</h5>
                            <ul>
                                <li>URL -  (URL of the SMS API)</li>
                                <li>Mobile Key - (Which will be the mobile key, each SMS provider have a different one, some have "to", some have "mobile", etc)</li>
                                <li>Message Key - (Which will be the text message key, each SMS provide have a different one, "text" or "message", etc)
                                </li>
                                <li>Payload -  which will be a JSON object, where you can enter any params according to the SMS service provider
                                </li>
                            </ul>

                            <p><u>Example:</u></p>
                            <ol className="mb-0">
                                <li>URL:  https://www.example.com/api/send-message </li>
                                <li>Mobile Key:  "to"</li>
                                <li>Message Key: {" "}"message"</li>
                                <li>Payload:  &#123;"data" : &#123;"from":"InfoSMS","destinations": &#123; "to":"taken customer number"&#125;,"text":"taken from SMS template"&#125;&#125;</li>
                            </ol>
                        </div>
                    </div>
                    <div className="container overflow-auto">
                        {/*<Form>*/}
                        <div className='row  mb-3 border-bottom align-items-center'>
                            <div className="col-2"></div>
                            <div className='col-4 custom-text-center'>
                                <label className='form-label'>
                                    {getFormattedMessage( "key.lable" )}
                                </label>
                            </div>
                            <div className='col-5 custom-text-center '>
                                <label className='form-label'>
                                    {getFormattedMessage( "key.value.lable" )}
                                </label>
                            </div>
                            <div className="col-1">
                                <button className="btn btn-primary mb-2" onClick={( e ) => handleAddClick( e )}>+
                                </button>
                            </div>
                        </div>
                        {smsValue?.map( ( item, i ) => {
                            return (
                                <div className='row align-items-center border-bottom mb-3 pb-3'>
                                    <div className="col-2 text-end fw-bold">
                                        {i === 0 && getFormattedMessage( "url.lable" )}
                                        {i === 1 && getFormattedMessage( "mobile.key.lable" )}
                                        {i === 2 && getFormattedMessage( "message.key.lable" )}
                                        {i === 3 && getFormattedMessage( "Payload.key.lable" )}
                                        {i === 0 || i === 1 || i === 2 || i === 3 ? <span className='required' /> : null}
                                    </div>
                                    <div className='col-4'>
                                        <input type='text' name="key"
                                            placeholder={
                                                i === 0 && placeholderText( 'url.lable' ) ||
                                                i === 1 && placeholderText( 'mobile.key.lable' ) || i === 2 && placeholderText( 'message.key.lable' ) || i === 3 && placeholderText( 'Payload.key.lable' )
                                            }
                                            className='form-control'
                                            readOnly={i === 0 || i === 1 || i === 2 || i === 3 ? true : false}
                                            onChange={( e ) => handleInputChange( e, i )}
                                            value={item.key}
                                        />
                                    </div>
                                    <div className='col-5 '>
                                        {/* http://example.com/api/sendhttp.php */}
                                        {i === 3 ?
                                            <textarea name='value' className='form-control' type='text' rows='5'
                                                placeholder={placeholderText( 'expense.input.details.placeholder.label' )}
                                                onChange={( e ) => handleInputChange( e, i )}
                                                value={item.value} /> :
                                            <input type='text' name="value"
                                                className='form-control'
                                                onChange={( e ) => handleInputChange( e, i )}
                                                value={item.value}
                                            />}
                                        <span
                                            className='text-danger d-block fw-400 fs-small'>{errors[ `${i}` ] ? errors[ `${i}` ] : null}</span>
                                    </div>
                                    <div className="col-1">
                                        <button className={`btn btn-danger ${i === 0 || i === 1 || i === 2 || i === 3 ? "disabled" : ""}`} onClick={() => handleRemoveClick( i )}>-</button>
                                    </div>
                                </div>
                            )
                        } )}
                        <ModelFooter onEditRecord={smsApiData} onSubmit={onSubmit}
                            editDisabled={disabled} cancelNotShow={true}
                        />
                        {/*</Form>*/}
                    </div>
                </div>
            </div>
        </MasterLayout>
    )
};


const mapStateToProps = ( state ) => {
    const { isLoading, smsApiData } = state;
    return { isLoading, smsApiData }
};

export default connect( mapStateToProps, { fetchSmsApiSetting, updateSmsApiSetting } )( SmsApi );
