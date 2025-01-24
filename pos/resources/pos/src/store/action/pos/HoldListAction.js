import apiConfig from "../../../config/apiConfig";
import { apiBaseURL, holdListActionType, toastType } from "../../../constants";
import { addToast } from "./../toastAction";
import { removeFromTotalRecord } from "./../totalRecordAction";
import { setLoading } from "./../loadingAction";
import requestParam from "../../../shared/requestParam";
import { getFormattedMessage } from "../../../shared/sharedMethod";

export const fetchHoldLists =
    (filter = {}) =>
    async (dispatch) => {
        const admin = true;
        let url = apiBaseURL.HOLDS_LIST;
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
                dispatch({
                    type: holdListActionType.FETCH_HOLDS,
                    payload: response.data.data,
                });
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

export const fetchHoldList =
    (HoldId, singleSale, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(apiBaseURL.HOLDS_LIST + "/" + HoldId + "/edit", singleSale)
            .then((response) => {
                dispatch({
                    type: holdListActionType.FETCH_HOLD,
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

export const addHoldList = (holdlist, navigate) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.HOLDS_LIST, holdlist)
        .then((response) => {
            dispatch({
                type: holdListActionType.ADD_HOLD,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "hold-list.success.create.message"
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

export const deleteHoldItem = (hold_id) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.HOLDS_LIST + "/" + hold_id)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: holdListActionType.DELETE_HOLD, payload: userId });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
