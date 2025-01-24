import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap-v5';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import { fetchSetting, editSetting, fetchCacheClear, fetchState } from '../../store/action/settingAction';
import { fetchCurrencies } from '../../store/action/currencyAction';
import { fetchAllCustomer } from '../../store/action/customerAction';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import ImagePicker from '../../shared/image-picker/ImagePicker';
import { getFormattedMessage, numValidate, placeholderText } from '../../shared/sharedMethod';
import languages from '../../shared/option-lists/Language.json'
import sms from '../../shared/option-lists/Sms.json'
import ReactSelect from '../../shared/select/reactSelect';
import HeaderTitle from "../header/HeaderTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import dateFormatOptions from "./dateFormatOptions.json"

const Settings = ( props ) => {
    const {
        fetchSetting,
        fetchCacheClear,
        fetchCurrencies,
        fetchAllCustomer,
        customers,
        fetchAllWarehouses,
        warehouses,
        editSetting,
        currencies,
        settings,
        fetchState,
        countryState,
        dateFormat,
        defaultCountry
    } = props;

    const [ settingValue, setSettingValue ] = useState( {
        currency: '',
        currency_symbol: '',
        email: '',
        logo: '',
        company_name: '',
        phone: '',
        developed: '',
        footer: '',
        default_language: '',
        default_customer: '',
        default_warehouse: '',
        warehouse_name: '',
        address: '',
        dateFormat: "",
        stripe_key: '',
        stripe_secret: '',
        sms_gateway: '',
        twillo_sid: '',
        twillo_token: '',
        twillo_from: '',
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
        smtp_Encryption: '',
        show_version_on_footer: '',
        country: '',
        countries: '',
        state: '',
        postCode: '',
        date_format: "",
        Currency_icon_Right_side: ''
    } );
    const [ defaultDate, setDefaultDate ] = useState( null )
    const [ imagePreviewUrl, setImagePreviewUrl ] = useState();
    const [ byDefaultCountry, setByDefaultCountry ] = useState( null )
    const [ selectImg, setSelectImg ] = useState( null );
    const [ errors, setErrors ] = useState( {
        currency: '',
        currency_symbol: '',
        email: '',
        company_name: '',
        phone: '',
        developed: '',
        footer: '',
        default_language: '',
        default_customer: '',
        default_warehouse: '',
        warehouse_name: '',
        address: '',
        stripe_key: '',
        stripe_secret: '',
        sms_gateway: '',
        twillo_sid: '',
        twillo_token: '',
        twillo_from: '',
        smtp_host: '',
        smtp_port: '',
        smtp_username: '',
        smtp_password: '',
        smtp_Encryption: '',
        show_version_on_footer: '',
        city: '',
        // postCode: '',
        country: '',
        date_format: "",
        Currency_icon_Right_side: ""
    } );

    const [ disable, setDisable ] = React.useState( true );
    const [ checked, setChecked ] = useState( false )

    const newLanguages = languages.filter( ( language ) => language.value );
    // const currencies = useSelector((state) => state.currencies)
    // const settings = useSelector((state) => state.settings)
    const [ selectedLanguage ] = useState( newLanguages ? ( [ {
        label: newLanguages[ 0 ].label, value: newLanguages[ 0 ].value
    } ] ) : null );

    const newSms = sms.filter( ( item ) => item.value );
    const [ selectedSms ] = useState( newSms ? ( [ {
        label: newSms[ 0 ].label, value: newSms[ 0 ].values
    } ] ) : null );

    useEffect( () => {
        fetchSetting();
        fetchCurrencies();
        fetchAllCustomer();
        fetchAllWarehouses();
    }, [] );


    useEffect( () => {
        if ( settings ) {
            setSettingValue( {
                currency: settings.attributes && settings.attributes.currency ? { value: Number( settings.attributes.currency ), label: settings.attributes.currency_symbol } : '',
                currency_symbol: settings.attributes && settings.attributes.currency_symbol ? settings.attributes.currency_symbol : '',
                email: settings.attributes && settings.attributes.email ? settings.attributes.email : '',
                logo: settings.attributes && settings.attributes.logo ? settings.attributes.logo : '',
                company_name: settings.attributes && settings.attributes.company_name ? settings.attributes.company_name : '',
                phone: settings.attributes && settings.attributes.phone ? settings.attributes.phone : '',
                developed: settings.attributes && settings.attributes.developed ? settings.attributes.developed : '',
                footer: settings.attributes && settings.attributes.footer ? settings.attributes.footer : '',
                default_language: settings.attributes && settings.attributes.default_language ? settings.attributes.default_language : '',
                default_customer: settings.attributes && settings.attributes.default_customer ? { value: Number( settings.attributes.default_customer ), label: settings.attributes.customer_name } : '',
                default_warehouse: settings.attributes && settings.attributes.default_warehouse ? { value: Number( settings.attributes.default_warehouse ), label: settings.attributes.warehouse_name } : '',
                warehouse_name: settings.attributes && settings.attributes.warehouse_name ? settings.attributes.warehouse_name : '',
                address: settings.attributes && settings.attributes.address ? settings.attributes.address : '',
                stripe_key: settings.attributes && settings.attributes.stripe_key ? settings.attributes.stripe_key : '',
                stripe_secret: settings.attributes && settings.attributes.stripe_secret ? settings.attributes.stripe_secret : '',
                sms_gateway: settings.attributes && settings.attributes.sms_gateway ? settings.attributes.sms_gateway : '',
                twillo_sid: settings.attributes && settings.attributes.twillo_sid ? settings.attributes.twillo_sid : '',
                twillo_token: settings.attributes && settings.attributes.twillo_token ? settings.attributes.twillo_token : '',
                twillo_from: settings.attributes && settings.attributes.twillo_from ? settings.attributes.twillo_from : '',
                smtp_host: settings.attributes && settings.attributes.smtp_host ? settings.attributes.smtp_host : '',
                smtp_port: settings.attributes && settings.attributes.smtp_port ? settings.attributes.smtp_port : '',
                smtp_username: settings.attributes && settings.attributes.smtp_username ? settings.attributes.smtp_username : '',
                smtp_password: settings.attributes && settings.attributes.smtp_password ? settings.attributes.smtp_password : '',
                smtp_Encryption: settings.attributes && settings.attributes.smtp_Encryption ? settings.attributes.smtp_Encryption : '',
                show_version_on_footer: settings.attributes && settings.attributes.show_version_on_footer !== '1' ? false : true,
                city: settings.attributes && settings.attributes.city ? settings.attributes.city : '',
                postCode: settings.attributes && settings.attributes.postcode ? settings.attributes.postcode : '',
                countries: settings.attributes && settings.attributes.countries && byDefaultCountry ? { value: byDefaultCountry.id, label: byDefaultCountry.name } : '',
                country: settings.attributes && settings.attributes.country ? { value: settings.attributes.country, label: settings.attributes.country } : '',
                state: settings.attributes && settings.attributes.country ? { value: settings.attributes.state, label: settings.attributes.state } : '',
                date_format: settings.attributes && settings.attributes.date_format && defaultDate ? { value: defaultDate.value, label: defaultDate.label } : '',
                Currency_icon_Right_side: settings.attributes && settings.attributes.is_currency_right !== 'true' ? false : true,
            } )
            if ( settings.attributes && settings.attributes.show_version_on_footer === "1" ) {
                setChecked( true )
            } else {
                setChecked( false )
            }
        }
    }, [ settings, defaultDate ] );

    useEffect( () => {
        if ( dateFormat ) {
            const defaultDateFormat = dateFormat ? dateFormatOptions.filter( ( date ) => date.value === dateFormat ) : null
            defaultDateFormat && setDefaultDate( defaultDateFormat[ 0 ] )
        }
    }, [ dateFormat ] )

    useEffect( () => {
        if ( defaultCountry ) {
            const countries = defaultCountry && defaultCountry.countries && defaultCountry.countries.filter( ( country ) => country.name === defaultCountry.country )
            countries && setByDefaultCountry( countries[ 0 ] )
        }
    }, [ defaultCountry ] )

    useEffect( () => {
        byDefaultCountry && fetchState( byDefaultCountry && byDefaultCountry.id )
    }, [ byDefaultCountry ] )

    const [ checkState, setCheckState ] = useState( false )
    const [ allState, setAllState ] = useState( null )

    useEffect( () => {
        if ( countryState.value ) {
            setCheckState( true )
            setAllState( countryState )
        }
    }, [ settings, countryState ] )

    const stateOptions = checkState && allState && allState.value && allState.value.map( ( item ) => {
        return {
            id: item,
            name: item
        }
    } )

    const onLanguagesChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, default_language: obj } ) )
    };

    const onSmsChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, sms_gateway: obj } ) )
    };

    const onCurrencyChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, currency: obj } ) )
        setErrors( '' );
    };

    const onCustomerChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, default_customer: obj } ) )
        setErrors( '' );
    };

    const onWarehouseChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, default_warehouse: obj } ) )
        setErrors( '' );
    };

    const onCountryChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, country: obj } ) )
        setSettingValue( settingValue => ( { ...settingValue, state: null } ) )
        fetchState( obj.value )
        setErrors( '' );
    };

    const onStateChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, state: obj } ) )
        setErrors( '' );
    };

    const handleImageChange = ( e ) => {
        e.preventDefault();
        setDisable( false );
        if ( e.target.files.length > 0 ) {
            const file = e.target.files[ 0 ];
            if ( file.type === 'image/jpeg' || file.type === 'image/png' ) {
                setSelectImg( file );
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    setImagePreviewUrl( fileReader.result );
                }
                if ( file ) {
                    fileReader.readAsDataURL( file );
                }
                setErrors( '' );
            }
        }
    };

    const handleChanged = ( event ) => {
        let checked = event.target.checked;
        setDisable( false )
        setChecked( checked );
        setSettingValue( settingValue => ( { ...settingValue, show_version_on_footer: checked } ) )
    };

    // checkedCurrency
    const [ checkedCurrency, setCheckedCurrency ] = useState( false )
    const handleChangedCurrency = ( event ) => {
        let checked = event.target.checked;
        setDisable( false )
        setCheckedCurrency( checked );
        setSettingValue( settingValue => ( { ...settingValue, Currency_icon_Right_side: checked } ) )
    };

    const onChangeInput = ( event ) => {
        event.preventDefault();
        setDisable( false );
        setSettingValue( inputs => ( { ...inputs, [ event.target.name ]: event.target.value } ) )
        setErrors( '' );
    };

    const prepareFormData = ( data ) => {
        const formData = new FormData();
        formData.append( 'currency', data.currency.value ? data.currency.value : data.currency );
        formData.append( 'email', data.email );
        if ( selectImg ) {
            formData.append( 'logo', data.logo );
        }
        formData.append( 'company_name', data.company_name );
        formData.append( 'phone', data.phone );
        formData.append( 'developed', data.developed );
        formData.append( 'footer', data.footer );
        if ( data.default_language.value ) {
            formData.append( 'default_language', data.default_language.value );
        } else {
            formData.append( 'default_language', data.default_language );
        }
        formData.append( 'default_customer', data.default_customer.value ? data.default_customer.value : data.default_customer );
        formData.append( 'default_warehouse', data.default_warehouse.value ? data.default_warehouse.value : data.default_warehouse );
        formData.append( 'address', data.address );
        formData.append( 'stripe_key', data.stripe_key );
        formData.append( 'stripe_secret', data.stripe_secret );
        formData.append( 'sms_gateway', data.sms_gateway );
        formData.append( 'twillo_sid', data.twillo_sid );
        formData.append( 'twillo_token', data.twillo_token );
        formData.append( 'twillo_from', data.twillo_from );
        formData.append( 'smtp_host', data.smtp_host );
        formData.append( 'smtp_port', data.smtp_port );
        formData.append( 'smtp_username', data.smtp_username );
        formData.append( 'smtp_password', data.smtp_password );
        formData.append( 'smtp_Encryption', data.smtp_Encryption );
        formData.append( 'show_version_on_footer', data.show_version_on_footer === true ? "1" : "0" );
        formData.append( 'city', data.city );
        formData.append( 'postcode', data.postCode );
        formData.append( 'country', data.country.label );
        formData.append( 'state', data.state.label );
        formData.append( 'date_format', data.date_format.value );
        formData.append( 'is_currency_right', data.Currency_icon_Right_side );
        return formData;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !settingValue[ 'currency' ] ) {
            errorss[ 'currency' ] = getFormattedMessage( "settings.system-settings.select.default-currency.validate.label" );
        } else if ( !settingValue[ 'email' ] ) {
            errorss[ 'email' ] = getFormattedMessage( "globally.input.email.validate.label" );
        } else if ( !settingValue[ 'company_name' ] ) {
            errorss[ 'company_name' ] = getFormattedMessage( "settings.system-settings.input.company-name.validate.label" );
        } else if ( !settingValue[ 'phone' ] ) {
            errorss[ 'phone' ] = getFormattedMessage( "settings.system-settings.input.company-phone.validate.label" );
        } else if ( !settingValue[ 'developed' ] ) {
            errorss[ 'developed' ] = getFormattedMessage( "settings.system-settings.input.developed-by.validate.label" );
        } else if ( !settingValue[ 'footer' ] ) {
            errorss[ 'footer' ] = getFormattedMessage( "settings.system-settings.input.footer.validate.label" );
        } else if ( !settingValue[ 'default_language' ] ) {
            errorss[ 'default_language' ] = getFormattedMessage( "settings.system-settings.select.default-language.validate.label" );
        } else if ( !settingValue[ 'default_customer' ] ) {
            errorss[ 'default_customer' ] = getFormattedMessage( "settings.system-settings.select.default-customer.validate.label" );
        } else if ( !settingValue[ 'default_warehouse' ] ) {
            errorss[ 'default_warehouse' ] = getFormattedMessage( "settings.system-settings.select.default-warehouse.validate.label" );
        } else if ( !settingValue[ 'address' ] ) {
            errorss[ 'address' ] = getFormattedMessage( "settings.system-settings.select.address.validate.label" );
        } else if ( ( settingValue[ 'address' ] && settingValue[ 'address' ].length > 150 ) ) {
            errorss[ 'address' ] = getFormattedMessage( "settings.system-settings.select.address.valid.validate.label" );
        } else if ( !settingValue[ 'sms_gateway' ] ) {
            errorss[ 'sms_gateway' ] = getFormattedMessage( "settings.sms-configuration.select.sms-gateway.validate.label" );
        } else if ( !settingValue[ 'twillo_sid' ] ) {
            errorss[ 'twillo_sid' ] = getFormattedMessage( "settings.sms-configuration.input.twilio-sid.validate.label" );
        } else if ( !settingValue[ 'twillo_token' ] ) {
            errorss[ 'twillo_token' ] = getFormattedMessage( "settings.sms-configuration.input.twilio-token.validate.label" );
        } else if ( !settingValue[ 'twillo_from' ] ) {
            errorss[ 'twillo_from' ] = getFormattedMessage( "settings.sms-configuration.select.twilio-from.validate.label" );
        } else if ( !settingValue[ 'smtp_host' ] ) {
            errorss[ 'smtp_host' ] = getFormattedMessage( "settings.smtp-configuration.input.host.validate.label" );
        } else if ( !settingValue[ 'smtp_port' ] ) {
            errorss[ 'smtp_port' ] = getFormattedMessage( "settings.smtp-configuration.input.port.validate.label" );
        } else if ( !settingValue[ 'smtp_username' ] ) {
            errorss[ 'smtp_username' ] = getFormattedMessage( "settings.smtp-configuration.input.username.validate.label" );
        } else if ( !settingValue[ 'smtp_password' ] ) {
            errorss[ 'smtp_password' ] = getFormattedMessage( "settings.smtp-configuration.input.password.validate.label" );
        } else if ( !settingValue[ 'smtp_Encryption' ] ) {
            errorss[ 'smtp_Encryption' ] = getFormattedMessage( "settings.smtp-configuration.input.encryption.validate.label" );
        } else if ( !settingValue[ 'city' ] ) {
            errorss[ 'city' ] = getFormattedMessage( "settings.system-settings.input.footer.validate.label" );
        } else if ( !settingValue[ 'postCode' ] ) {
            errorss[ 'postCode' ] = getFormattedMessage( "settings.system-settings.select.postcode.validate.label" );
        }
        // else if (settingValue['postCode'].length > 8) {
        //     errorss['postCode'] = getFormattedMessage("settings.system-settings.select.postcode.validate.length.label");
        // }
        else if ( !settingValue[ 'country' ] ) {
            errorss[ 'country' ] = getFormattedMessage( "settings.system-settings.select.country.validate.label" );
        } else if ( !settingValue[ 'state' ] ) {
            errorss[ 'state' ] = getFormattedMessage( "settings.system-settings.select.state.validate.label" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onEdit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        settingValue.logo = selectImg;
        if ( valid ) {
            editSetting( prepareFormData( settingValue ), true, setDefaultDate );
            setDisable( true );
        }
    };

    const onCacheClear = ( event ) => {
        event.preventDefault();
        fetchCacheClear();
    };

    const onDateFormatChange = ( obj ) => {
        setDisable( false );
        setSettingValue( settingValue => ( { ...settingValue, date_format: obj } ) )
        setErrors( '' );
    }

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( "settings.title" )} />
            <HeaderTitle title={getFormattedMessage( 'settings.system-settings.title' )} />
            <>
                <div className='card'>
                    <div className='card-body'>
                        <Form>
                            <div className='row'>
                                <div className='col-lg-6 mb-3'>
                                    <div>
                                        {settings && settings.attributes && settingValue.currency && <ReactSelect
                                            title={getFormattedMessage( "settings.system-settings.select.default-currency.label" )}
                                            placeholder={placeholderText( "settings.system-settings.select.default-currency.placeholder.label" )}
                                            defaultValue={settings ? settings.attributes && settingValue.currency : ""}
                                            data={currencies} onChange={onCurrencyChange} errors={errors[ 'currency' ]} />}
                                    </div>
                                    <div className='mt-3'>
                                        <div>{getFormattedMessage( "currency.icon.right.side.lable" )}</div>
                                        <div className="d-flex align-items-center mt-2">
                                            <label className="form-check form-switch form-switch-sm">
                                                <input type='checkbox' checked={settingValue.Currency_icon_Right_side}
                                                    name='Currency_icon_Right_side'
                                                    onChange={( event ) => handleChangedCurrency( event )}
                                                    className='me-3 form-check-input cursor-pointer' />
                                                <div className='control__indicator' />
                                            </label>
                                            <span className="switch-slider" data-checked="✓" data-unchecked="✕">
                                                {errors[ 'Currency_icon_Right_side' ] ? errors[ 'Currency_icon_Right_side' ] : null}
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "settings.system-settings.input.default-email.label" )}:
                                    </label>
                                    <input type='email' className="form-control"
                                        placeholder={placeholderText( "settings.system-settings.input.default-email.placeholder.label" )}
                                        name='email' value={settingValue.email}
                                        onChange={( e ) => onChangeInput( e )}
                                    />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'email' ] ? errors[ 'email' ] : null}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <ImagePicker imageTitle={placeholderText( "globally.input.change-logo.tooltip" )}
                                        imagePreviewUrl={imagePreviewUrl ? imagePreviewUrl : settings.attributes && settings.attributes.logo}
                                        handleImageChange={handleImageChange} />
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "settings.system-settings.input.company-name.label" )}:
                                    </label>
                                    <input type='text' className="form-control"
                                        placeholder={placeholderText( "settings.system-settings.input.company-name.placeholder.label" )}
                                        name='company_name'
                                        value={settingValue.company_name}
                                        onChange={( e ) => onChangeInput( e )} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'company_name' ] ? errors[ 'company_name' ] : null}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "settings.system-settings.input.company-phone.label" )}:</label>
                                    <Form.Control type='number' className="form-control"
                                        placeholder={placeholderText( "settings.system-settings.input.company-phone.placeholder.label" )}
                                        name='phone' min={0} value={settingValue.phone}
                                        onKeyPress={( event ) => numValidate( event )}
                                        onChange={onChangeInput} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'phone' ] ? errors[ 'phone' ] : null}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "settings.system-settings.input.developed-by.label" )}:
                                    </label>
                                    <input type='text' className="form-control"
                                        placeholder={placeholderText( "settings.system-settings.input.developed-by.placeholder.label" )}
                                        name='developed'
                                        value={settingValue.developed}
                                        onChange={( e ) => onChangeInput( e )} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'developed' ] ? errors[ 'developed' ] : null}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "settings.system-settings.input.footer.label" )}
                                        :</label>
                                    <input type='text' className="form-control"
                                        placeholder={placeholderText( "settings.system-settings.input.footer.placeholder.label" )}
                                        name='footer' value={settingValue.footer}
                                        onChange={( e ) => onChangeInput( e )} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'footer' ] ? errors[ 'footer' ] : null}
                                    </span>
                                </div>
                                {/*<div className='col-lg-6'>*/}
                                {/*    <ReactSelect title={getFormattedMessage("settings.system-settings.select.default-language.label")} placeholder={placeholderText("settings.system-settings.select.default-language.placeholder.label")} defaultValue={selectedLanguage}*/}
                                {/*                 data={languages} onChange={onLanguagesChange} errors={errors['default_language']}/>*/}
                                {/*</div>*/}
                                <div className='col-lg-6 mb-3'>
                                    {settings && settings.attributes && settingValue.default_customer && <ReactSelect
                                        title={getFormattedMessage( "settings.system-settings.select.default-customer.label" )}
                                        placeholder={placeholderText( "settings.system-settings.select.default-customer.placeholder.label" )}
                                        defaultValue={settings ? settings.attributes && settingValue.default_customer : ""}
                                        data={customers} onChange={onCustomerChange}
                                        errors={errors[ 'default_customer' ]} />}
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    {settings && settings.attributes && settingValue.default_warehouse && <ReactSelect
                                        title={getFormattedMessage( "settings.system-settings.select.default-warehouse.label" )}
                                        placeholder={placeholderText( "settings.system-settings.select.default-warehouse.label" )}
                                        defaultValue={settings ? settings.attributes && settingValue.default_warehouse : ""}
                                        data={warehouses} onChange={onWarehouseChange}
                                        errors={errors[ 'default_warehouse' ]} />}
                                </div>

                                {/* Country  */}
                                <div className='col-lg-6 mb-3'>
                                    {settings && settings.attributes && byDefaultCountry && <ReactSelect
                                        title={getFormattedMessage( "globally.input.country.label" )}
                                        placeholder={placeholderText( "globally.input.country.label" )}
                                        defaultValue={settings && settings.attributes && byDefaultCountry ? { label: settingValue.country.label, value: settingValue.country.value } : ""}
                                        name='country'
                                        multiLanguageOption={defaultCountry.countries ? defaultCountry.countries : []} onChange={onCountryChange}
                                        errors={errors[ 'country' ]} />}
                                </div>
                                {/* state  */}
                                <div className='col-lg-6 mb-3'>
                                    {settings && settings.attributes && stateOptions.length && <ReactSelect
                                        title={getFormattedMessage( "setting.state.lable" )}
                                        placeholder={placeholderText( "setting.state.lable" )}
                                        name='state'
                                        value={settingValue && settingValue.state !== null ? settingValue.state : ''}
                                        multiLanguageOption={stateOptions} onChange={onStateChange}
                                        errors={errors[ 'state' ]} />}
                                </div>
                                {/* City  */}
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "globally.input.city.label" )}
                                        :</label>
                                    <input type='text' className="form-control"
                                        placeholder={placeholderText( 'globally.input.city.label' )}
                                        name='city' value={settingValue.city}
                                        onChange={( e ) => onChangeInput( e )} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'city' ] ? errors[ 'city' ] : null}
                                    </span>
                                </div>
                                {/* POST code */}
                                <div className='col-lg-6 mb-3'>
                                    <label className='form-label'>
                                        {getFormattedMessage( "setting.postCode.lable" )}:</label>
                                    <Form.Control type='text' className="form-control"
                                        placeholder={placeholderText( 'setting.postCode.lable' )}
                                        name='postCode' min={0} value={settingValue.postCode}
                                        onKeyPress={( event ) => event}
                                        onChange={onChangeInput} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {/* {errors['postCode'] ? errors['postCode'] : null} */}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    {settings && settings.attributes && settings.attributes.date_format && defaultDate && settingValue.date_format && <ReactSelect
                                        title={getFormattedMessage( "settings.system-settings.select.date-format.label" )}
                                        placeholder={placeholderText( "settings.system-settings.select.default-warehouse.label" )}
                                        defaultValue={settings ? settings.attributes && settingValue.date_format : ""}
                                        data={dateFormatOptions} onChange={onDateFormatChange}
                                        errors={errors[ 'date_format' ]} />}
                                </div>
                                <div className='col-12 mb-3'>
                                    <label
                                        className='form-label'>{getFormattedMessage( "globally.input.address.label" )}:</label>
                                    <textarea className="form-control" rows={3}
                                        placeholder={placeholderText( "globally.input.address.placeholder.label" )}
                                        name='address'
                                        value={settingValue.address}
                                        onChange={( e ) => onChangeInput( e )} />
                                    <span className='text-danger d-block fw-400 fs-small mt-2'>
                                        {errors[ 'address' ] ? errors[ 'address' ] : null}
                                    </span>
                                </div>
                                <div className='col-lg-6 mb-3'>
                                    <div className="col-md-6">
                                        <label className='form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label'>
                                            <input type='checkbox'
                                                name='show_version_on_footer'
                                                value={checked} checked={checked}
                                                onChange={( event ) => handleChanged( event )} className='me-3 form-check-input cursor-pointer' />
                                            <div className='control__indicator' /> {getFormattedMessage( "settings.system-settings.select.default-version-footer.placeholder.label" )}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <button disabled={disable} className='btn btn-primary'
                                        onClick={( event ) => onEdit( event )}>
                                        {getFormattedMessage( "globally.save-btn" )}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>

                {/*<div className='w-100 mx-auto pt-lg-10 pt-5'>*/}
                {/*    <h4 className='mb-5'>{getFormattedMessage("settings.smtp-configuration.title")}</h4>*/}
                {/*    <Form className='card card-body'>*/}
                {/*        <div className='row'>*/}
                {/*            <div className='col-lg-6 mb-3'>*/}
                {/*                <label className='form-label'>*/}
                {/*                    {getFormattedMessage("settings.smtp-configuration.input.host.label")}:*/}
                {/*                </label>*/}
                {/*                <input type='text' className="form-control"*/}
                {/*                       placeholder={placeholderText("settings.smtp-configuration.input.host.label")}*/}
                {/*                       name='smtp_host' value={settingValue.smtp_host}*/}
                {/*                       onChange={(e) => onChangeInput(e)}/>*/}
                {/*                <span className='text-danger d-block fw-400 fs-small mt-2'>*/}
                {/*                        {errors['smtp_host'] ? errors['smtp_host'] : null}*/}
                {/*                    </span>*/}
                {/*            </div>*/}
                {/*            <div className='col-lg-6 mb-3'>*/}
                {/*                <label className='form-label'>*/}
                {/*                    {getFormattedMessage("settings.smtp-configuration.input.port.label")}:*/}
                {/*                </label>*/}
                {/*                <input type='text' className="form-control"*/}
                {/*                       placeholder={placeholderText("settings.payment-gateway.input.stripe-key.placeholder.label")}*/}
                {/*                       name='smtp_port'*/}
                {/*                       value={settingValue.smtp_port}*/}
                {/*                       onChange={(e) => onChangeInput(e)}/>*/}
                {/*                <span className='text-danger d-block fw-400 fs-small mt-2'>*/}
                {/*                        {errors['smtp_port'] ? errors['smtp_port'] : null}*/}
                {/*                    </span>*/}
                {/*            </div>*/}
                {/*            <div className='col-lg-6 mb-3'>*/}
                {/*                <label className='form-label'>*/}
                {/*                    {getFormattedMessage("settings.smtp-configuration.input.username.label")}:*/}
                {/*                </label>*/}
                {/*                <input type='text' className="form-control"*/}
                {/*                       placeholder={placeholderText("settings.smtp-configuration.input.username.label")}*/}
                {/*                       name='smtp_username'*/}
                {/*                       value={settingValue.smtp_username}*/}
                {/*                       onChange={(e) => onChangeInput(e)}/>*/}
                {/*                <span className='text-danger d-block fw-400 fs-small mt-2'>*/}
                {/*                        {errors['smtp_username'] ? errors['smtp_username'] : null}*/}
                {/*                    </span>*/}
                {/*            </div>*/}
                {/*            <div className='col-lg-6 mb-3'>*/}
                {/*                <label className='form-label'>*/}
                {/*                    {getFormattedMessage("settings.smtp-configuration.input.password.label")}:*/}
                {/*                </label>*/}
                {/*                <Form.Control type='text'*/}
                {/*                              placeholder={placeholderText("settings.smtp-configuration.input.password.label")}*/}
                {/*                              className="form-control" name='smtp_password'*/}
                {/*                              value={settingValue.smtp_password}*/}
                {/*                              onChange={(e) => onChangeInput(e)}/>*/}
                {/*                <span className='text-danger d-block fw-400 fs-small mt-2'>*/}
                {/*                        {errors['smtp_password'] ? errors['smtp_password'] : null}*/}
                {/*                    </span>*/}
                {/*            </div>*/}
                {/*            <div className='col-lg-6 mb-3'>*/}
                {/*                <label className='form-label'>*/}
                {/*                    {getFormattedMessage("settings.smtp-configuration.input.encryption.label")}:*/}
                {/*                </label>*/}
                {/*                <input type='text'*/}
                {/*                       placeholder={placeholderText("settings.smtp-configuration.input.encryption.label")}*/}
                {/*                       className="form-control" name='smtp_Encryption'*/}
                {/*                       value={settingValue.smtp_Encryption}*/}
                {/*                       onChange={(e) => onChangeInput(e)}/>*/}
                {/*                <span className='text-danger d-block fw-400 fs-small mt-2'>*/}
                {/*                        {errors['smtp_Encryption'] ? errors['smtp_Encryption'] : null}*/}
                {/*                    </span>*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <button className='btn btn-primary' disabled={disable}*/}
                {/*                        onClick={(event) => onEdit(event)}>*/}
                {/*                    {getFormattedMessage("globally.submit-btn")}*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </Form>*/}
                {/*</div>*/}

                <div className='w-100 mx-auto pt-lg-10 pt-5'>
                    <h4 className='mb-5'>{getFormattedMessage( "settings.clear-cache.title" )}</h4>
                    <Form className='card card-body'>
                        <div className='row'>
                            <div>
                                <button className='btn btn-primary' onClick={( event ) => onCacheClear( event )}>
                                    {getFormattedMessage( "settings.clear-cache.title" )}
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>

                {/*<div className='w-100 px-lg-8 px-5 mx-auto pt-lg-10 pt-5'>*/}
                {/*    <div className='mb-8'>*/}
                {/*        <h4 className='mb-5'>{getFormattedMessage("settings.payment-gateway.title")}</h4>*/}
                {/*        <Form className='card card-custom p-9'>*/}
                {/*            <div className='row'>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <Form.Group className='mb-5' controlId='formBasicStripe_key'>*/}
                {/*                        <Form.Label*/}
                {/*                            className='fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("settings.payment-gateway.input.stripe-key.label")}:</Form.Label>*/}
                {/*                        <Form.Control type="text" className="form-control-solid"*/}
                {/*                                      placeholder={placeholderText("settings.payment-gateway.input.stripe-key.placeholder.label")}*/}
                {/*                        />*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <Form.Group className='mb-5' controlId='formBasicStripe_secret'>*/}
                {/*                        <Form.Label*/}
                {/*                            className='fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("settings.payment-gateway.input.stripe-secret.label")}:</Form.Label>*/}
                {/*                        <Form.Control type='password'*/}
                {/*                                      className='form-control-solid'*/}
                {/*                                      placeholder={placeholderText("settings.payment-gateway.input.stripe-key.placeholder.label")}*/}
                {/*                                      name='stripe_secret'*/}
                {/*                                      value={settingValue.stripe_secret}*/}
                {/*                                      onChange={(e) => onChangeInput(e)}/>*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div className='col-lg-4'>*/}
                {/*                    <Form.Group className='mb-5 d-flex align-items-center'*/}
                {/*                                controlId='formBasicSwitch'>*/}
                {/*                        <Form.Check*/}
                {/*                            type='switch'*/}
                {/*                            id='custom-switch'*/}
                {/*                            className='me-3'*/}
                {/*                        />*/}
                {/*                        <Form.Label className='fs-6 fw-bolder text-gray-700 mb-3'>*/}
                {/*                            {getFormattedMessage("settings.payment-gateway.switch-btn.label")}*/}
                {/*                             </Form.Label>*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <Button variant='primary' disabled={disable}*/}
                {/*                            onClick={(event) => onEdit(event)}>*/}
                {/*                        {getFormattedMessage("globally.submit-btn")}*/}
                {/*                    </Button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </Form>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className='w-100 px-lg-8 px-5 mx-auto pt-lg-10 pt-5'>*/}
                {/*    <div className='mb-8'>*/}
                {/*        <h4 className='mb-5'>{getFormattedMessage("settings.sms-configuration.title")}</h4>*/}
                {/*        <Form className='card card-custom p-9'>*/}
                {/*            <div className='row'>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <ReactSelect*/}
                {/*                        title={getFormattedMessage("settings.sms-configuration.select.sms-gateway.label")}*/}
                {/*                        placeholder={placeholderText("settings.sms-configuration.select.sms-gateway.placeholder.label")}*/}
                {/*                        defaultValue={selectedSms}*/}
                {/*                        data={sms} onChange={onSmsChange} errors={errors['sms_gateway']}/>*/}
                {/*                </div>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <Form.Group className='mb-5' controlId='formBasicTwillo_sid'>*/}
                {/*                        <Form.Label*/}
                {/*                            className='fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("settings.sms-configuration.input.twilio-sid.label")}:</Form.Label>*/}
                {/*                        <Form.Control type='text'*/}
                {/*                                      className="form-control-solid"*/}
                {/*                                      name='twillo_sid'*/}
                {/*                                      value={settingValue.twillo_sid}*/}
                {/*                                      placeholder={placeholderText("settings.sms-configuration.input.twilio-sid.placeholder.label")}*/}
                {/*                                      onChange={(e) => onChangeInput(e)}/>*/}
                {/*                        <span className='text-danger'>*/}
                {/*                        {errors['twillo_sid'] ? errors['twillo_sid'] : null}*/}
                {/*                    </span>*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <Form.Group className='mb-5' controlId='formBasicToken'>*/}
                {/*                        <Form.Label*/}
                {/*                            className='fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("settings.sms-configuration.input.twilio-token.label")}:</Form.Label>*/}
                {/*                        <Form.Control type='text'*/}
                {/*                                      className="form-control-solid"*/}
                {/*                                      placeholder={placeholderText("settings.payment-gateway.input.stripe-key.placeholder.label")}*/}
                {/*                                      name='twillo_token'*/}
                {/*                                      value={settingValue.twillo_token}*/}
                {/*                                      onChange={(e) => onChangeInput(e)}/>*/}
                {/*                        <span className='text-danger'>*/}
                {/*                        {errors['twillo_token'] ? errors['twillo_token'] : null}*/}
                {/*                    </span>*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div className='col-lg-6'>*/}
                {/*                    <Form.Group className='mb-5' controlId='formBasicName'>*/}
                {/*                        <Form.Label*/}
                {/*                            className='fs-6 fw-bolder text-gray-700 mb-3'>{getFormattedMessage("settings.sms-configuration.select.twilio-from.label")}:</Form.Label>*/}
                {/*                        <Form.Control type='text' placeholder={placeholderText("settings.sms-configuration.select.twilio-from.placeholder.label")}*/}
                {/*                                      className="form-control-solid"*/}
                {/*                                      name='twillo_from'*/}
                {/*                                      value={settingValue.twillo_from}*/}
                {/*                                      onChange={(e) => onChangeInput(e)}/>*/}
                {/*                        <span className='text-danger'>*/}
                {/*                        {errors['twillo_from'] ? errors['twillo_from'] : null}*/}
                {/*                    </span>*/}
                {/*                    </Form.Group>*/}
                {/*                </div>*/}
                {/*                <div>*/}
                {/*                    <Button variant='primary' disabled={disable}*/}
                {/*                            onClick={(event) => onEdit(event)}>*/}
                {/*                        {getFormattedMessage("globally.submit-btn")}*/}
                {/*                            </Button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </Form>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </>
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { customers, warehouses, settings, currencies, countryState, dateFormat, defaultCountry } = state;
    return { customers, warehouses, settings, currencies, countryState, dateFormat, defaultCountry }
};

export default connect( mapStateToProps, { fetchSetting, fetchCurrencies, fetchCacheClear, fetchAllCustomer, fetchAllWarehouses, editSetting, fetchState } )( Settings );
