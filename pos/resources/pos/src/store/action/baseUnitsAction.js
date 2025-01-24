import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    toastType,
    baseUnitsActionType,
    Filters,
} from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchBaseUnits =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.BASE_UNITS;
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
                    type: baseUnitsActionType.FETCH_UNITS,
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
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const fetchBaseUnit = (unitId, singleUnit) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.BASE_UNITS + "/" + unitId, singleUnit)
        .then((response) => {
            dispatch({
                type: baseUnitsActionType.FETCH_UNIT,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addBaseUnit = (base_units) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.BASE_UNITS, base_units)
        .then((response) => {
            dispatch({
                type: baseUnitsActionType.ADD_UNIT,
                payload: response.data.data,
            });
            dispatch(fetchBaseUnits(Filters.OBJ));
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "base-unit.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};

export const editBaseUnit =
    (unitId, units, handleClose) => async (dispatch) => {
        apiConfig
            .patch(apiBaseURL.BASE_UNITS + "/" + unitId, units)
            .then((response) => {
                dispatch({
                    type: baseUnitsActionType.EDIT_UNIT,
                    payload: response.data.data,
                });
                handleClose(false);
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "base-unit.success.edit.message"
                        ),
                    })
                );
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteBaseUnit = (unitId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.BASE_UNITS + "/" + unitId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: baseUnitsActionType.DELETE_UNIT,
                payload: unitId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "base-unit.success.delete.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};

export const fetchAllBaseUnits = () => async (dispatch) => {
    apiConfig
        .get(`base-units?page[size]=0`)
        .then((response) => {
            dispatch({
                type: baseUnitsActionType.FETCH_ALL_BASE_UNITS,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        });
};
