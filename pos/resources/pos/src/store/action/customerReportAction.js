import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, customerActionType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import { setTotalRecord } from "./totalRecordAction";
import { setLoading } from "./loadingAction";

export const fetchCustomersReport =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.CUSTOMERS_REPORT;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at ||
                filter.warehouse_id)
        ) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: customerActionType.FETCH_CUSTOMERS_REPORT,
                    payload: response.data.data.data,
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

export const fetchCustomerSalePayment =
    (filter = {}, isLoading = true, id) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.CUSTOMER_PAYMENT_REPORT + "/" + id;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at ||
                filter.customer_id)
        ) {
            url += requestParam(filter, admin, null, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                dispatch({
                    type: customerActionType.FETCH_CUSTOMERS_PAYMENT_REPORT,
                    payload: response.data.data.data,
                });
                dispatch(setTotalRecord(response.data.data.total));
            })
            .catch((response) => {
                dispatch(
                    addToast({
                        text: response.response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const customerPdfAction =
    (customerId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.CUSTOMER_REPORT_PDF + "/" + customerId)
            .then((response) => {
                window.open(
                    response.data.data.customers_report_pdf_url,
                    "_blank"
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

export const customerSaleReportPDF = (id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CUSTOMER_SALES_REPORT_PDF + "/" + id)
        .then((response) => {
            window.open(response.data.data.customers_sales_pdf_url, "_blank");
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const customerSaleReturnReportPDF = (id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CUSTOMER_SALES_RETURNS_REPORT_PDF + "/" + id)
        .then((response) => {
            window.open(response.data.data.customers_returns_pdf_url, "_blank");
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const customerQutationReportPDF = (id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CUSTOMER_QUOTATIONS_REPORT_PDF + "/" + id)
        .then((response) => {
            window.open(
                response.data.data.customers_quotations_pdf_url,
                "_blank"
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const customerSalePaymentReportPDF = (id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CUSTOMER_PAYMENT_REPORT_PDF + "/" + id)
        .then((response) => {
            window.open(
                response.data.data.customers_payments_pdf_url,
                "_blank"
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
