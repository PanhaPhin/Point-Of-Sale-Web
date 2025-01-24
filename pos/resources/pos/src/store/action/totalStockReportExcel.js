import apiConfig from '../../config/apiConfig';
import {setLoading} from './loadingAction';

export const totalStockReportExcel = (warehouse, filter = {}, isLoading = true, setIsWarehouseValue) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`stock-report-excel?warehouse_id=${warehouse}`)
        .then((response) => {
            window.open(response.data.data.stock_report_excel_url, '_blank');
            setIsWarehouseValue(false);
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(() => {
        });
};
