import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, topCustomersActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

export const fetchStockAlert = () => async (dispatch) => {
    dispatch(setLoading(true));

    apiConfig.get(apiBaseURL.STOCK_ALERT)
        .then((response) => {
            dispatch({type: topCustomersActionType.FETCH_STOCK_ALERT, payload: response.data.data})
            dispatch(setLoading(false));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
            dispatch(setLoading(false));
        });
}
