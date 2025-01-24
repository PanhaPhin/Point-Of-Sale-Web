import { setLoading } from "./loadingAction";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, saleActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { callSaleApi } from "./saleApiAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setTotalRecord } from "./totalRecordAction";

export const createSalePayment =
    (salePayment, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .post(
                apiBaseURL.SALES +
                    "/" +
                    salePayment.sale_id +
                    "/capture-payment",
                salePayment
            )
            .then((response) => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                dispatch(callSaleApi(true));
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "sale.payment.create.success"
                        ),
                    })
                );
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const fetchSalePayments =
    (sale_id, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.SALES + "/" + sale_id + "/payments")
            .then((response) => {
                dispatch({
                    type: saleActionType.FETCH_SALE_PAYMENT,
                    payload: response.data.data,
                });
                dispatch(
                    setTotalRecord(
                        response.data.meta.total !== undefined &&
                            response.data.meta.total >= 0
                            ? response.data.meta.total
                            : response.data.data.total
                    )
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const editSalePayment =
    (details, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .post(
                apiBaseURL.SALES + "/" + details.payment_id + "/payment",
                details
            )
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage("sale.payment.edit.success"),
                    })
                );
                const data = response.data.data.attributes;
                const newData = Object.assign(data, {
                    id: response.data.data.id,
                });
                newData &&
                    dispatch({
                        type: saleActionType.EDIT_SALE_PAYMENT,
                        payload: newData,
                    });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteSalePayment =
    (paymentId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .delete(apiBaseURL.SALES + "/" + paymentId + "/payment")
            .then((response) => {
                dispatch({
                    type: saleActionType.DELETE_SALE_PAYMENT,
                    payload: paymentId,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };
