import apiConfig from '../../config/apiConfig';
import {toastType} from '../../constants';
import {addToast} from './toastAction';

export const fetchTopSellingExcel = (dates, setIsWarehouseValue) => async (dispatch) => {
    await apiConfig.get(`top-selling-product-report-excel?start_date=${dates.start_date ? dates.start_date : null }&end_date=${dates.end_date ? dates.end_date : null}`)
        .then((response) => {
            window.open(response.data.data.top_selling_product_excel_url, '_blank');
            setIsWarehouseValue(false);
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

