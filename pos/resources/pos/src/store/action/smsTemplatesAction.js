import apiConfig from "../../config/apiConfig";
import { apiBaseURL, smsTemplatesActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import { setTotalRecord } from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchSmsTemplates =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.SMS_TEMPLATES;
        if (
            !_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search || filter.order_By)
        ) {
            url += requestParam(filter, false, false, true, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: smsTemplatesActionType.FETCH_SMS_TEMPLATES,
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

export const fetchSmsTemplate = (Id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.SMS_TEMPLATES + "/" + Id + "/edit")
        .then((response) => {
            dispatch({
                type: smsTemplatesActionType.FETCH_SMS_TEMPLATE,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const UpdateSmsTemplate =
    (Id, smsTemplate, navigate) => async (dispatch) => {
        apiConfig
            .put(apiBaseURL.SMS_TEMPLATES + "/" + Id, smsTemplate)
            .then((response) => {
                dispatch({
                    type: smsTemplatesActionType.EDIT_SMS_TEMPLATE,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "sms-template.success.edit.message"
                        ),
                    })
                );
                navigate("/app/sms-templates");
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

export const activeInactiveSms = (Id) => async (dispatch) => {
    apiConfig
        .post(apiBaseURL.SMS_TEMPLATES_STATUS + "/" + Id)
        .then((response) => {
            dispatch({
                type: smsTemplatesActionType.SET_ACTIVE_DE_ACTIVE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "sms.status.edit.success.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
