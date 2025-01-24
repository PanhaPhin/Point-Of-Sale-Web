import apiConfig from "../../config/apiConfig";
import { apiBaseURL, adjustMentActionType, toastType } from "../../constants";
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

export const fetchAdjustments =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.ADJUSTMENTS;
        if (
            !_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search)
        ) {
            url += requestParam(filter, admin, null, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: adjustMentActionType.FETCH_ADJUSTMENTS,
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
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const fetchAdjustment =
    (adjustmentId, singleAdjustment, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(
                apiBaseURL.ADJUSTMENTS + "/" + adjustmentId + "/edit",
                singleAdjustment
            )
            .then((response) => {
                dispatch({
                    type: adjustMentActionType.FETCH_ADJUSTMENT,
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

export const addAdjustment = (adjustment, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.ADJUSTMENTS, adjustment)
        .then((response) => {
            dispatch({
                type: adjustMentActionType.ADD_ADJUSTMENTS,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "Adjustment.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
            navigate("/app/adjustments");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editAdjustment =
    (adjustmentId, adjustment, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.ADJUSTMENTS + "/" + adjustmentId, adjustment)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "Adjustment.success.edit.message"
                        ),
                    })
                );
                navigate("/app/adjustments");
                dispatch({
                    type: adjustMentActionType.EDIT_ADJUSTMENTS,
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

export const deleteAdjustment = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.ADJUSTMENTS + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: adjustMentActionType.DELETE_ADJUSTMENT,
                payload: userId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "Adjustment.success.delete.message"
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
