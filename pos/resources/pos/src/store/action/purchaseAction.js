import apiConfig from "../../config/apiConfig";
import { apiBaseURL, purchaseActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchPurchases =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.PURCHASES;
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
                    type: purchaseActionType.FETCH_PURCHASES,
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

export const fetchPurchase =
    (purchaseId, singlePurchase, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(
                apiBaseURL.PURCHASES + "/" + purchaseId + "/edit",
                singlePurchase
            )
            .then((response) => {
                dispatch({
                    type: purchaseActionType.FETCH_PURCHASE,
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

export const addPurchase = (purchase, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    apiConfig
        .post(apiBaseURL.PURCHASES, purchase)
        .then((response) => {
            dispatch({
                type: purchaseActionType.ADD_PURCHASE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "purchase.success.create.message"
                    ),
                })
            );
            navigate("/app/purchases");
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

export const editPurchase =
    (purchaseId, purchase, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        apiConfig
            .put(apiBaseURL.PURCHASES + "/" + purchaseId, purchase)
            .then((response) => {
                navigate("/app/purchases");
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "purchase.success.edit.message"
                        ),
                    })
                );
                dispatch({
                    type: purchaseActionType.EDIT_PURCHASE,
                    payload: response.data.data,
                });
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

export const deletePurchase = (purchaseId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.PURCHASES + "/" + purchaseId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: purchaseActionType.DELETE_PURCHASE,
                payload: purchaseId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "purchase.success.delete.message"
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
