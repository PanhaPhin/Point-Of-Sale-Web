import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap-v5";
import {
    decimalValidate,
    getFormattedMessage,
    getFormattedOptions,
    placeholderText,
} from "../../shared/sharedMethod";
import moment from "moment";
import { Row } from "reactstrap";
import ReactDatePicker from "../../shared/datepicker/ReactDatePicker";
import { paymentMethodOptions } from "../../constants";
import ReactSelect from "../../shared/select/reactSelect";
import ModelFooter from "../../shared/components/modelFooter";
import { useDispatch } from "react-redux";
import { createSalePayment } from "../../store/action/salePaymentAction";

const CreatePaymentModal = (props) => {
    const {
        onCreatePaymentClick,
        isCreatePaymentOpen,
        createPaymentItem,
        setIsCreatePaymentOpen,
    } = props;
    const dispatch = useDispatch();
    const [paymentValue, setPaymentValue] = useState({
        reference: "",
        payment_date: new Date(),
        payment_type: "",
        amount: "",
        paid_amount: "",
        sale_id: "",
        amount_to_pay: "",
    });

    useEffect(() => {
        if (createPaymentItem) {
            setPaymentValue({
                payment_type:
                    paymentTypeDefaultValue && paymentTypeDefaultValue[0],
                payment_date: createPaymentItem?.date
                    ? moment(createPaymentItem?.date).toDate()
                    : new Date(),
                amount_to_pay: createPaymentItem
                    ? createPaymentItem?.grand_total -
                      createPaymentItem?.paid_amount
                    : "",
                sale_id: createPaymentItem ? createPaymentItem?.id : "",
                amount: createPaymentItem
                    ? createPaymentItem?.grand_total -
                      createPaymentItem?.paid_amount
                    : "",
            });
        }
    }, [createPaymentItem]);

    const paymentMethodOption = getFormattedOptions(paymentMethodOptions);
    const paymentTypeDefaultValue = paymentMethodOption.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });

    const handleCallback = (date) => {
        setPaymentValue((previousState) => {
            return { ...previousState, payment_date: date };
        });
    };

    const onPaymentMethodChange = (obj) => {
        setPaymentValue((paymentValue) => ({
            ...paymentValue,
            payment_type: obj,
        }));
    };

    const [errors, setErrors] = useState({
        amount: "",
    });

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        if (!paymentValue["amount"]) {
            error["amount"] = getFormattedMessage(
                "globally.require-input.validate.label"
            );
        } else if (
            paymentValue["amount"] &&
            paymentValue["amount"] > paymentValue["amount_to_pay"]
        ) {
            error["amount"] = getFormattedMessage(
                "paying-amount-validate-label"
            );
        } else {
            isValid = true;
        }
        setErrors(error);
        return isValid;
    };

    const prepareFormData = (prepareData) => {
        const formValue = {
            reference: prepareData.reference,
            payment_date: moment(prepareData.payment_date).format("YYYY-MM-DD"),
            payment_type: prepareData.payment_type.value,
            amount: prepareData.amount,
            sale_id: prepareData.sale_id,
            received_amount: prepareData.amount_to_pay,
        };
        return formValue;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            dispatch(createSalePayment(prepareFormData(paymentValue)));
            // clearField()
            setIsCreatePaymentOpen(false);
        }
    };

    const clearField = () => {
        setIsCreatePaymentOpen(false);
    };

    const onChangeAmount = (e) => {
        setPaymentValue((paymentValue) => ({
            ...paymentValue,
            amount: e.target.value,
        }));
    };

    const onChangeReference = (e) => {
        setPaymentValue((paymentValue) => ({
            ...paymentValue,
            reference: e.target.value,
        }));
    };

    return (
        <Modal
            show={isCreatePaymentOpen}
            onHide={onCreatePaymentClick}
            size="lg"
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {getFormattedMessage("create-payment-title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <div className="col-4 mb-3">
                        <label className="form-label">
                            {getFormattedMessage(
                                "react-data-table.date.column.label"
                            )}{" "}
                            :
                        </label>
                        <ReactDatePicker
                            onChangeDate={handleCallback}
                            newStartDate={
                                paymentValue.payment_date
                                    ? paymentValue.payment_date
                                    : new Date()
                            }
                        />
                    </div>
                    <div className="col-4 mb-3">
                        <label className="form-label">
                            {getFormattedMessage("globally.detail.reference")} :
                        </label>
                        {/*<span className='required'/>*/}
                        <input
                            type="text"
                            name="reference"
                            placeholder={placeholderText(
                                "reference-placeholder-label"
                            )}
                            className="form-control"
                            autoFocus={true}
                            onChange={(e) => onChangeReference(e)}
                            value={paymentValue.reference}
                        />
                    </div>
                    <div className="col-4 mb-3">
                        <ReactSelect
                            title={getFormattedMessage(
                                "globally.react-table.column.payment-type.label"
                            )}
                            // placeholder={placeholderText("payment-type-options.placeholder.label")}
                            defaultValue={paymentTypeDefaultValue[0]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentMethodChange}
                            // errors={errors['base_unit']}
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label">
                            {getFormattedMessage("input-Amount-to-pay-title")} :
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Reference"
                            className="form-control"
                            autoFocus={true}
                            readOnly={true}
                            onChange={(e) => onChangeInput(e)}
                            value={paymentValue.amount_to_pay}
                        />
                    </div>
                    <div className="col-4">
                        <label className="form-label">
                            {getFormattedMessage("paying-amount-title")} :
                        </label>
                        <span className="required" />
                        <input
                            type="text"
                            name="amount"
                            // placeholder={placeholderText("globally.input.name.placeholder.label")}
                            placeholder="Enter Paying Amount"
                            className="form-control"
                            autoFocus={true}
                            onKeyPress={(event) => decimalValidate(event)}
                            onChange={(e) => onChangeAmount(e)}
                            value={paymentValue.amount}
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                            {errors["amount"] ? errors["amount"] : null}
                        </span>
                    </div>
                    <ModelFooter clearField={clearField} onSubmit={onSubmit} />
                </Row>
            </Modal.Body>
        </Modal>
    );
};
export default CreatePaymentModal;
