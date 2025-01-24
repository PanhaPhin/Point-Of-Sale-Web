import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    unitsActionType,
    toastType,
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

export const fetchUnits =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.UNITS;
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
                    type: unitsActionType.FETCH_UNITS,
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

export const fetchAllunits = () => async (dispatch) => {
    apiConfig
        .get(`units?page[size]=0`)
        .then((response) => {
            dispatch({
                type: warehouseActionType.FETCH_UNITS,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const fetchUnit = (unitId, singleUnit) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.UNITS + "/" + unitId, singleUnit)
        .then((response) => {
            dispatch({
                type: unitsActionType.FETCH_UNIT,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addUnit = (units) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.UNITS, units)
        .then((response) => {
            dispatch({
                type: unitsActionType.ADD_UNIT,
                payload: response.data.data,
            });
            dispatch(fetchUnits(Filters.OBJ));
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.create.message"),
                })
            );
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editUnit = (unitId, units, handleClose) => async (dispatch) => {
    apiConfig
        .patch(apiBaseURL.UNITS + "/" + unitId, units)
        .then((response) => {
            dispatch({
                type: unitsActionType.EDIT_UNIT,
                payload: response.data.data,
            });
            handleClose(false);
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.edit.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteUnit = (unitId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.UNITS + "/" + unitId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: unitsActionType.DELETE_UNIT, payload: unitId });
            dispatch(
                addToast({
                    text: getFormattedMessage("unit.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
