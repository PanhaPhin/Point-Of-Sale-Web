import { setLoading } from "./loadingAction";
import { apiBaseURL, stockReportActionType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";

export const stockReportAction =
    (id, filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const stockReport = true;
        let url = apiBaseURL.STOCK_REPORT + "?warehouse_id=" + id;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, false, stockReport, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: stockReportActionType.STOCK_REPORT,
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
                // dispatch(addToast(
                //     {text: response.data.message, type: toastType.ERROR}));
            });
    };
