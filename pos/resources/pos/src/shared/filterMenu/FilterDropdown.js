import React, { useCallback, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import ReactSelect from '../select/reactSelect';
import { getFormattedMessage, getFormattedOptions } from '../sharedMethod';
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { baseUnitOptions, paymentStatusOptions, paymentTypeOptions, statusOptions, transferStatusOptions } from "../../constants";
import { fetchAllBaseUnits } from "../../store/action/baseUnitsAction";

const FilterDropdown = ( props ) => {
    const {
        paymentStatus,
        status,
        onStatusChange,
        isUnitFilter,
        onPaymentStatusChange,
        isStatus,
        isPaymentStatus,
        productUnit,
        onProductUnitChange,
        title,
        onResetClick,
        paymentType,
        onPaymentTypeChange,
        isPaymentType,
        isWarehouseType,
        onWarehouseChange,
        warehouseOptions,
        tableWarehouseValue,
        isTransferStatus,
        onTransferStatusChange,
        transferStatus,
        fetchAllBaseUnits,
        base
    } = props;

    const dispatch = useDispatch();
    const isReset = useSelector( ( state ) => state.resetOption );
    const isShow = useSelector( ( state ) => state.dropDownToggle );
    const menuRef = useRef( null );
    const baseUnitFilterOptions = getFormattedOptions( baseUnitOptions )
    const statusFilterOptions = getFormattedOptions( statusOptions )
    const paymentFilterOptions = getFormattedOptions( paymentStatusOptions )
    const paymentTypeFilterOptions = getFormattedOptions( paymentTypeOptions )

    useEffect( () => {
        fetchAllBaseUnits()
    }, [ fetchAllBaseUnits ] )

    const transferStatusFilterOptions = getFormattedOptions( transferStatusOptions )

    const unitDefaultValue = baseUnitFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const statusDefaultValue = statusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const transferStatusDefaultValue = transferStatusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const paymentStatusDefaultValue = paymentFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const paymentTypeDefaultValue = paymentTypeFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const warehouseDefaultValue = warehouseOptions && warehouseOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.attributes.name
        }
    } )

    const onReset = () => {
        dispatch( { type: 'RESET_OPTION', payload: true } )
        onResetClick();
    };

    const onToggle = () => {
        dispatch( { type: 'ON_TOGGLE', payload: !isShow } )
    };

    const escFunction = useCallback( ( event ) => {
        if ( event.keyCode === 27 ) {
            dispatch( { type: 'ON_TOGGLE', payload: false } )
        }
    }, [] );

    useEffect( () => {
        document.addEventListener( 'keydown', escFunction, false );
        return () => {
            document.removeEventListener( 'keydown', escFunction, false );
        };
    }, [] );

    useEffect( () => {
        const onClickOutside = ( event ) => {
            if ( menuRef.current.contains( event.target ) ) {
                return
            }
            dispatch( { type: 'ON_TOGGLE', payload: false } )
        };
        document.body.addEventListener( "click", onClickOutside )
        return () => {
            document.body.removeEventListener( "click", onClickOutside );
        }
    }, [] )

    return (
        <Dropdown className='me-3 mb-2 filter-dropdown order-1 order-sm-0' show={isShow} ref={menuRef}>
            <Dropdown.Toggle variant='primary' className='text-white btn-icon hide-arrow' id='filterDropdown'
                onClick={() => onToggle()}>
                <FontAwesomeIcon icon={faFilter} />
            </Dropdown.Toggle>
            <Dropdown.Menu className='px-7 py-5'>
                {isStatus ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='1' className='mb-5 p-0'>
                        <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status'
                            title={getFormattedMessage( 'purchase.select.status.label' )}
                            value={isReset ? statusDefaultValue[ 0 ] : status} isRequired
                            defaultValue={statusDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'purchase.select.status.label' )} />
                    </Dropdown.Header>
                    : null}
                {isPaymentStatus ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='2' className='mb-5 p-0'>
                        <ReactSelect multiLanguageOption={paymentFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                            title={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                            value={isReset ? paymentStatusDefaultValue[ 0 ] : paymentStatus} isRequired
                            defaultValue={paymentStatusDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                        />
                    </Dropdown.Header>
                    : null}
                {isUnitFilter ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='3' className='mb-5 p-0'>
                        <ReactSelect onChange={onProductUnitChange} name='product_unit'
                            title={title} value={isReset ? unitDefaultValue[ 0 ] : productUnit} isRequired
                            defaultValue={unitDefaultValue[ 0 ]}
                            placeholder={title} data={base}
                        />
                    </Dropdown.Header>
                    : null}
                {isPaymentType ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='4' className='mb-5 p-0'>
                        <ReactSelect multiLanguageOption={paymentTypeFilterOptions} onChange={onPaymentTypeChange} name='payment_type'
                            title={getFormattedMessage( 'select.payment-type.label' )}
                            value={isReset ? paymentTypeDefaultValue[ 0 ] : paymentType} isRequired
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'select.payment-type.label' )}
                        />
                    </Dropdown.Header>
                    : null}
                {isWarehouseType ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='4' className='mb-5 p-0'>
                        <ReactSelect data={warehouseOptions} onChange={onWarehouseChange} name='payment_type'
                            title={getFormattedMessage( 'dashboard.stockAlert.warehouse.label' )}
                            value={isReset ? warehouseDefaultValue[ 0 ] : tableWarehouseValue} isRequired
                            defaultValue={warehouseDefaultValue[ 0 ]}
                        // placeholder={getFormattedMessage('select.payment-type.label')}
                        />
                    </Dropdown.Header>
                    : null}
                {isTransferStatus ?
                    <Dropdown.Header onClick={( e ) => {
                        e.stopPropagation();
                    }} eventkey='1' className='mb-5 p-0'>
                        <ReactSelect multiLanguageOption={transferStatusFilterOptions} onChange={onTransferStatusChange} name='status'
                            title={getFormattedMessage( 'purchase.select.status.label' )}
                            value={isReset ? transferStatusDefaultValue[ 0 ] : transferStatus} isRequired
                            defaultValue={transferStatusDefaultValue[ 0 ]}
                            placeholder={getFormattedMessage( 'purchase.select.status.label' )} />
                    </Dropdown.Header>
                    : null}
                <div className='btn btn-secondary me-5' onClick={onReset}>{getFormattedMessage( "date-picker.filter.reset.label" )}</div>
            </Dropdown.Menu>
        </Dropdown>
    )
};

const mapStateToProps = ( state ) => {
    const { base } = state;
    return { base }
};

export default connect( mapStateToProps, { fetchAllBaseUnits } )( FilterDropdown );
