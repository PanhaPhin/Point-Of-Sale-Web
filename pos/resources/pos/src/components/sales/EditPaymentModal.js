import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap-v5';
import {
    decimalValidate,
    getFormattedMessage,
    getFormattedOptions,
    placeholderText
} from "../../shared/sharedMethod";
import moment from 'moment';
import { Row } from "reactstrap";
import ReactDatePicker from "../../shared/datepicker/ReactDatePicker";
import { paymentMethodOptions } from "../../constants";
import ReactSelect from "../../shared/select/reactSelect";
import ModelFooter from "../../shared/components/modelFooter";
import { useDispatch } from "react-redux";
import { editSalePayment } from "../../store/action/salePaymentAction";

const EditPaymentModal = ( props ) => {
    const { editSaleItem, isEditModalOpen, closeModal, createPaymentItem } = props;
    const dispatch = useDispatch()
    const [ paymentValue, setPaymentValue ] = useState( {
        amount_to_pay: "",
        payment_date: new Date(),
        payment_type: "",
        amount: "",
        paid_amount: '',
        payment_id: "",
        reference: ""
    } )
    useEffect( () => {
        if ( editSaleItem ) {
            setPaymentValue( {
                amount_to_pay: editSaleItem ? editSaleItem.received_amount : "",
                payment_type: paymentTypeDefaultValue && paymentTypeDefaultValue[ 0 ],
                payment_date: editSaleItem ? moment( editSaleItem.payment_date ).toDate() : '',
                // paid_amount: payment_date ? payment_date.paid_amount === "0.00" ? createPaymentItem.grand_total : createPaymentItem.paid_amount : '',
                payment_id: editSaleItem ? editSaleItem.id : "",
                amount: editSaleItem ? editSaleItem.amount : "",
                reference: editSaleItem ? editSaleItem.reference === null ? " " : editSaleItem.reference : "",
            } )
        }
    }, [ editSaleItem ] )

    const paymentMethodOption = getFormattedOptions( paymentMethodOptions )
    const paymentTypeDefaultValue = paymentMethodOption.filter( ( option ) => option.id === Number( editSaleItem.payment_type ) ).map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const handleCallback = ( date ) => {
        setPaymentValue( previousState => {
            return { ...previousState, payment_date: date }
        } );
    };

    const onPaymentMethodChange = ( obj ) => {
        setPaymentValue( paymentValue => ( { ...paymentValue, payment_type: obj } ) );
    };

    const prepareFormData = ( prepareData ) => {
        const formValue = {
            payment_date: moment( prepareData.payment_date ).format( 'YYYY-MM-DD' ),
            payment_type: prepareData.payment_type.value,
            amount: prepareData.amount,
            payment_id: prepareData.payment_id,
            reference: prepareData.reference,
            received_amount: prepareData.amount_to_pay
        }
        return formValue
    };

    const [ errors, setErrors ] = useState( {
        amount: '',
    } );

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if ( !paymentValue[ 'amount' ] ) {
            errorss[ 'amount' ] = getFormattedMessage( "globally.require-input.validate.label" );
        } else if ( ( paymentValue[ 'amount' ] && paymentValue[ 'amount' ] > paymentValue[ "amount_to_pay" ] ) ) {
            errorss[ 'amount' ] = getFormattedMessage( "paying-amount-validate-label" );
        } else {
            isValid = true;
        }
        setErrors( errorss );
        return isValid;
    }

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation()
        if ( valid ) {
            dispatch( editSalePayment( ( prepareFormData( paymentValue ) ) ) );
            clearField()
        }
    };

    const clearField = () => {
        closeModal( false );
    };

    const onChangeAmount = ( e ) => {
        setPaymentValue( paymentValue => ( { ...paymentValue, amount: e.target.value } ) );
    }

    const onChangeReference = ( e ) => {
        setPaymentValue( paymentValue => ( { ...paymentValue, reference: e.target.value } ) );
    }

    return (
        <Modal
            show={isEditModalOpen}
            onHide={closeModal} size='lg' keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {getFormattedMessage( "edit-payment-title" )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col-4 mb-3">
                        <label className='form-label'>
                            {getFormattedMessage( "react-data-table.date.column.label" )} :
                        </label>
                        <ReactDatePicker onChangeDate={handleCallback} newStartDate={paymentValue.payment_date} />
                    </div>
                    <div className="col-4 mb-3">
                        <label className='form-label'>
                            {getFormattedMessage( "globally.detail.reference" )} :
                        </label>
                        <input type='text' name='reference'
                            placeholder={placeholderText( "reference-placeholder-label" )}
                            className='form-control'
                            autoFocus={true}
                            readOnly={true}
                            onChange={( e ) => onChangeReference( e )}
                            value={paymentValue.reference}
                        />
                    </div>
                    <div className="col-4 mb-3">
                        <ReactSelect title={getFormattedMessage( "globally.react-table.column.payment-type.label" )}
                            // placeholder={placeholderText("payment-type-options.placeholder.label")}
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentMethodChange}
                        // errors={errors['base_unit']}
                        />
                    </div>
                    <div className="col-4">
                        <label className='form-label'>
                            {getFormattedMessage( "input-Amount-to-pay-title" )} :
                        </label>
                        <input type='text' name='name'
                            placeholder={placeholderText( "globally.input.name.placeholder.label" )}
                            className='form-control'
                            autoFocus={true}
                            readOnly={true}
                            value={paymentValue.amount_to_pay} />
                    </div>
                    <div className="col-4">
                        <label className='form-label'>
                            {getFormattedMessage( "paying-amount-title" )} :
                        </label>
                        <span className='required' />
                        <input type='text' name='amount'
                            // placeholder={placeholderText("globally.input.name.placeholder.label")}
                            className='form-control'
                            autoFocus={true}
                            placeholder="Enter Paying Amount"
                            onKeyPress={( event ) => decimalValidate( event )}
                            onChange={( e ) => onChangeAmount( e )}
                            value={paymentValue.amount} />
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'amount' ] ? errors[ 'amount' ] : null}</span>
                    </div>
                    <ModelFooter clearField={clearField} onSubmit={onSubmit} />
                </Row>
            </Modal.Body>
        </Modal>
    );
}
export default EditPaymentModal;
