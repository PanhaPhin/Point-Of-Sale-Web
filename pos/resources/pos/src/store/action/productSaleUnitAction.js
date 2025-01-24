import {toastType, saleActionType} from '../../constants';
import apiConfig from '../../config/apiConfig';
import {addToast} from './toastAction';

export const productSalesDropdown = (base_sale_value) => async (dispatch) => {
    apiConfig.get(`units?filter[base_unit]=${base_sale_value}`)
        .then((response) => {
            dispatch({type: saleActionType.PRODUCT_SALES_UNIT, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
