import apiConfig from "../../config/apiConfig";
import { apiBaseURL, quotationActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callSaleApi } from "./saleApiAction";
import { setSavingButton } from "./saveButtonAction";

export const fetchQuotations =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.QUOTATIONS;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, admin, null, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: quotationActionType.FETCH_QUOTATIONS,
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
                dispatch(callSaleApi(false));
                if (isLoading) {
                    dispatch(setLoading(false));
                }
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

export const fetchQuotation =
    (quotationId, singleQuotation, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(
                apiBaseURL.QUOTATIONS + "/" + quotationId + "/edit",
                singleQuotation
            )
            .then((response) => {
                dispatch({
                    type: quotationActionType.FETCH_QUOTATION,
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

export const addQuotation = (quotation, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.QUOTATIONS, quotation)
        .then((response) => {
            dispatch({
                type: quotationActionType.ADD_QUOTATION,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "quotation.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
            navigate("/app/quotations");
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

export const editQuotation =
    (quotationId, quotation, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.QUOTATIONS + "/" + quotationId, quotation)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "quotation.success.edit.message"
                        ),
                    })
                );
                navigate("/app/quotations");
                dispatch({
                    type: quotationActionType.EDIT_QUOTATION,
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

export const deleteQuotation = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.QUOTATIONS + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: quotationActionType.DELETE_QUOTATION,
                payload: userId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "quotation.success.delete.message"
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
