import apiConfig from "../../config/apiConfig";
import { apiBaseURL, dashboardActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { setTotalRecord } from "./totalRecordAction";

export const fetchAllSalePurchaseCount = () => async (dispatch) => {
    dispatch(setLoading(true));
    apiConfig
        .get(apiBaseURL.ALL_SALE_PURCHASE)
        .then((response) => {
            dispatch(
                setTotalRecord(
                    response.data.meta.total !== undefined &&
                        response.data.meta.total >= 0
                        ? response.data.meta.total
                        : response.data.data.total
                )
            );
            dispatch({
                type: dashboardActionType.FETCH_ALL_SALE_PURCHASE,
                payload: response.data.data,
            });
            dispatch(setLoading(false));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
            dispatch(setLoading(false));
        });
};
