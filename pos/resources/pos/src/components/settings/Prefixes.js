import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap-v5';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import { fetchSetting, editSetting } from '../../store/action/settingAction';
import { fetchCurrencies } from '../../store/action/currencyAction';
import { fetchAllCustomer } from '../../store/action/customerAction';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import HeaderTitle from "../header/HeaderTitle";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import Spinner from "../../shared/components/loaders/Spinner";

const Prefixes = ( props ) => {
    const {
        fetchSetting,
        fetchCurrencies,
        fetchAllCustomer,
        fetchAllWarehouses,
        editSetting,
        isLoading,
        settings
    } = props;

    const [ prefixesValue, setPrefixesValue ] = useState( {
        purchases: '',
        purchasesReturn: '',
        sales: '',
        salesReturn: '',
        expense: ''
    } )

    const [ errors, setErrors ] = useState( {
        purchases: '',
        purchasesReturn: '',
        sales: '',
        salesReturn: '',
        expense: ''
    } )

    const [ disable, setDisable ] = React.useState( true );

    useEffect( () => {
        fetchSetting();
        fetchCurrencies();
        fetchAllCustomer();
        fetchAllWarehouses();
    }, [] );

    useEffect( () => {
        if ( settings ) {
            setPrefixesValue( {
                purchases: settings.attributes && settings.attributes.purchase_code ? settings.attributes.purchase_code : '',
                purchasesReturn: settings.attributes && settings.attributes.purchase_return_code ? settings.attributes.purchase_return_code : '',
                sales: settings.attributes && settings.attributes.sale_code ? settings.attributes.sale_code : '',
                salesReturn: settings.attributes && settings.attributes.sale_return_code ? settings.attributes.sale_return_code : '',
                expense: settings.attributes && settings.attributes.expense_code ? settings.attributes.expense_code : ''
            } )
        }
    }, [ settings ] );

    const onChangeInput = ( event ) => {
        event.preventDefault();
        setDisable( false );
        setPrefixesValue( inputs => ( { ...inputs, [ event.target.name ]: event.target.value } ) )
        setErrors( '' );
    };

    const prepareFormData = ( data ) => {
        const formData = new FormData();
        formData.append( 'purchase_code', data.purchases );
        formData.append( 'purchase_return_code', data.purchasesReturn );
        formData.append( 'sale_code', data.sales );
        formData.append( 'sale_return_code', data.salesReturn );
        formData.append( 'expense_code', data.expense );
        return formData;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !prefixesValue[ 'purchases' ] ) {
            errorss[ 'purchases' ] = getFormattedMessage( "settings.prefixes-settings.input.purchases.validate.label" );
        } else if ( !prefixesValue[ 'purchasesReturn' ] ) {
            errorss[ 'purchasesReturn' ] = getFormattedMessage( "settings.prefixes-settings.input.purchases-return.validate.label" );
        } else if ( !prefixesValue[ 'sales' ] ) {
            errorss[ 'sales' ] = getFormattedMessage( "settings.prefixes-settings.input.sales.validate.label" );
        } else if ( !prefixesValue[ 'salesReturn' ] ) {
            errorss[ 'salesReturn' ] = getFormattedMessage( "settings.prefixes-settings.input.salse-return.validate.label" );
        } else if ( !prefixesValue[ 'expense' ] ) {
            errorss[ 'expense' ] = getFormattedMessage( "settings.prefixes-settings.input.expense.validate.label" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    };

    const onEdit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            editSetting( prepareFormData( prefixesValue ) );
            setDisable( true );
        }
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( "prefix.title" )} />
            <HeaderTitle title={getFormattedMessage( "prefix.title" )} />
            {isLoading ?
                <Spinner /> :
                <>
                    <div className='card'>
                        <div className='card-body'>
                            <Form>
                                <div className='row'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label'>
                                            {getFormattedMessage( "purchases.title" )}:</label>
                                        <span className='required' />
                                        <Form.Control type='text' className="form-control"
                                            placeholder={placeholderText( "settings.prefixes-settings.input.purchases.placeholder.label" )}
                                            name='purchases'
                                            onChange={onChangeInput} value={prefixesValue.purchases} />
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>
                                            {errors[ 'purchases' ] ? errors[ 'purchases' ] : null}
                                        </span>
                                    </div>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label'>
                                            {getFormattedMessage( "purchases.return.title" )}:
                                        </label>
                                        <span className='required' />
                                        <input type='text' className="form-control"
                                            placeholder={placeholderText( "settings.prefixes-settings.input.purchases-return.placeholder.label" )}
                                            name='purchasesReturn'
                                            onChange={( e ) => onChangeInput( e )}
                                            value={prefixesValue.purchasesReturn} />
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>
                                            {errors[ 'purchasesReturn' ] ? errors[ 'purchasesReturn' ] : null}
                                        </span>
                                    </div>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label'>
                                            {getFormattedMessage( "sales.title" )}:</label>
                                        <span className='required' />
                                        <Form.Control type='text' className="form-control"
                                            placeholder={placeholderText( "settings.prefixes-settings.input.sales.placeholder.label" )}
                                            name='sales'
                                            onChange={( e ) => onChangeInput( e )} value={prefixesValue.sales} />
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>
                                            {errors[ 'sales' ] ? errors[ 'sales' ] : null}
                                        </span>
                                    </div>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label'>
                                            {getFormattedMessage( "sales-return.title" )}:
                                        </label>
                                        <span className='required' />
                                        <input type='text' className="form-control"
                                            placeholder={placeholderText( "settings.prefixes-settings.input.salse-return.placeholder.label" )}
                                            name='salesReturn'
                                            onChange={( e ) => onChangeInput( e )} value={prefixesValue.salesReturn} />
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>
                                            {errors[ 'salesReturn' ] ? errors[ 'salesReturn' ] : null}
                                        </span>
                                    </div>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label'>
                                            {getFormattedMessage( "expense.title" )}:
                                        </label>
                                        <span className='required' />
                                        <input type='text' className="form-control"
                                            placeholder={placeholderText( "settings.prefixes-settings.input.expense.placeholder.label" )}
                                            name='expense'
                                            onChange={( e ) => onChangeInput( e )} value={prefixesValue.expense} />
                                        <span className='text-danger d-block fw-400 fs-small mt-2'>
                                            {errors[ 'expense' ] ? errors[ 'expense' ] : null}
                                        </span>
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
                </>
            }
        </MasterLayout>
    )
}

const mapStateToProps = ( state ) => {
    const { customers, warehouses, isLoading, settings, currencies } = state;
    return { customers, warehouses, isLoading, settings, currencies }
};

export default connect( mapStateToProps, {
    fetchSetting,
    fetchCurrencies,
    fetchAllCustomer,
    fetchAllWarehouses,
    editSetting
} )( Prefixes );
