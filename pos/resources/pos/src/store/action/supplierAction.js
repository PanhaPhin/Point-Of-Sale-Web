import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, supplierActionType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callImportProductApi } from "./importProductApiAction";

export const fetchSuppliers =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.SUPPLIERS;
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
                    type: supplierActionType.FETCH_SUPPLIERS,
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

export const fetchSupplier =
    (supplierId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.SUPPLIERS + "/" + supplierId)
            .then((response) => {
                dispatch({
                    type: supplierActionType.FETCH_SUPPLIER,
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

export const addSupplier = (supplier, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.SUPPLIERS, supplier)
        .then((response) => {
            dispatch({
                type: supplierActionType.ADD_SUPPLIER,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "supplier.success.create.message"
                    ),
                })
            );
            navigate("/app/suppliers");
            dispatch(addInToTotalRecord(1));
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editSupplier =
    (supplierId, supplier, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        apiConfig
            .patch(apiBaseURL.SUPPLIERS + "/" + supplierId, supplier)
            .then((response) => {
                dispatch({
                    type: supplierActionType.EDIT_SUPPLIER,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "supplier.success.edit.message"
                        ),
                    })
                );
                navigate("/app/suppliers");
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

export const deleteSupplier = (supplierId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.SUPPLIERS + "/" + supplierId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: supplierActionType.DELETE_SUPPLIER,
                payload: supplierId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "supplier.success.delete.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const fetchAllSuppliers = () => async (dispatch) => {
    apiConfig
        .get(`suppliers?page[size]=0`)
        .then((response) => {
            dispatch({
                type: supplierActionType.FETCH_ALL_SUPPLIERS,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addImportSupplier = (importSupplier) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.IMPORT_SUPPLIER, importSupplier)
        .then((response) => {
            dispatch(setLoading(false));
            dispatch(callImportProductApi(true));
            dispatch(addToast({ text: "Product Import Create Success " }));
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
