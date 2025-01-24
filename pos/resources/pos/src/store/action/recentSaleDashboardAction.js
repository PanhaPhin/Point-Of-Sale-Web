import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, recentSaleActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

export const recentSales = () => async (dispatch) => {
    dispatch(setLoading(true));

    apiConfig.get(apiBaseURL.RECENT_SALES)
        .then((response) => {
            dispatch({type: recentSaleActionType.RECENT_SALES, payload: response.data.data})
            dispatch(setLoading(false));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
            dispatch(setLoading(false));
        });
}
