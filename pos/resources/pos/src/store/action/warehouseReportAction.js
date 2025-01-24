import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, warehouseActionType} from '../../constants';
import {addToast} from './toastAction';

export const fetchWarehouseReport = (id) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.WAREHOUSE_REPORT + '?warehouse_id=' + id)
        .then((response) => {
            dispatch({type: warehouseActionType.FETCH_WAREHOUSE_REPORT, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
