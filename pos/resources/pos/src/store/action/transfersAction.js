import apiConfig from "../../config/apiConfig";
import { apiBaseURL, transferActionType, toastType } from "../../constants";
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

export const fetchTransfers =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.TRANSFERS;
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
                    type: transferActionType.FETCH_TRANSFERS,
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

export const addTransfer = (transfer, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    apiConfig
        .post(apiBaseURL.TRANSFERS, transfer)
        .then((response) => {
            dispatch({
                type: transferActionType.ADD_TRANSFER,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "transfer.success.create.message"
                    ),
                })
            );
            navigate("/app/transfers");
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

export const fetchTransfer =
    (transferId, singleTransfer, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(
                apiBaseURL.TRANSFERS + "/" + transferId + "/edit",
                singleTransfer
            )
            .then((response) => {
                dispatch({
                    type: transferActionType.FETCH_TRANSFER,
                    payload: response.data.data,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
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

export const editTransfer =
    (transferId, transfer, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.TRANSFERS + "/" + transferId, transfer)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage("sale.success.edit.message"),
                    })
                );
                navigate("/app/transfers");
                dispatch({
                    type: transferActionType.EDIT_TRANSFER,
                    payload: response.data.data,
                });
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

export const deletetransfer = (transferId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.TRANSFERS + "/" + transferId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "transfer.success.delete.message"
                    ),
                })
            );
            dispatch({
                type: transferActionType.DELETE_TRANSFER,
                payload: purchaseId,
            });
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
