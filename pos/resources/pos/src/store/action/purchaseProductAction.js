import apiConfig from '../../config/apiConfig';
import {apiBaseURL, purchaseProductActionType, toastType} from '../../constants';
import {addToast} from "./toastAction";

export const searchPurchaseProduct = (productId) => async (dispatch) => {
    apiConfig.get(apiBaseURL.PRODUCTS + '/' + productId)
        .then((response) => {
            dispatch({type: purchaseProductActionType.SEARCH_PURCHASE_PRODUCTS, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
