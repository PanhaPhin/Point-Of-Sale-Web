import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, customerActionType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callImportProductApi } from "./importProductApiAction";
import moment from "moment";

export const fetchCustomers =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.CUSTOMERS;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: customerActionType.FETCH_CUSTOMERS,
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

export const fetchCustomer =
    (customerId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.CUSTOMERS + "/" + customerId)
            .then((response) => {
                dispatch({
                    type: customerActionType.FETCH_CUSTOMER,
                    payload: response.data.data,
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

export const addCustomer = (supplier, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.CUSTOMERS, supplier)
        .then((response) => {
            dispatch({
                type: customerActionType.ADD_CUSTOMER,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "customer.success.create.message"
                    ),
                })
            );
            navigate("/app/customers");
            dispatch(addInToTotalRecord(1));
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};

export const editCustomer =
    (customerId, customer, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        const { name, dob, email, phone, country, city, address } = customer;
        const data = {
            name,
            dob: dob === null ? null : moment(dob).format("YYYY-MM-DD"),
            email,
            phone,
            country,
            city,
            address,
        };
        apiConfig
            .patch(apiBaseURL.CUSTOMERS + "/" + customerId, data)
            .then((response) => {
                dispatch({
                    type: customerActionType.EDIT_CUSTOMER,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "customer.success.edit.message"
                        ),
                    })
                );
                navigate("/app/customers");
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteCustomer = (customerId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.CUSTOMERS + "/" + customerId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: customerActionType.DELETE_CUSTOMER,
                payload: customerId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "customer.success.delete.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};

export const fetchAllCustomer = () => async (dispatch) => {
    apiConfig
        .get(`customers?page[size]=0`)
        .then((response) => {
            dispatch({
                type: customerActionType.FETCH_ALL_CUSTOMER,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addImportCustomers = (importData) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.IMPORT_CUSTOMERS, importData)
        .then((response) => {
            dispatch(setLoading(false));
            dispatch(callImportProductApi(true));
            // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
            dispatch(addToast({ text: "Customers Import Create Success " }));
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};
