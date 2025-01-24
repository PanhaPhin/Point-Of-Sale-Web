import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    emailTemplatesActionType,
    toastType,
} from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import { setTotalRecord } from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchEmailTemplates =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.EMAIL_TEMPLATES;
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
                    type: emailTemplatesActionType.FETCH_EMAIL_TEMPLATES,
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

export const fetchEmailTemplate = (Id) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.EMAIL_TEMPLATES + "/" + Id + "/edit")
        .then((response) => {
            dispatch({
                type: emailTemplatesActionType.FETCH_EMAIL_TEMPLATE,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const UpdateEmailTemplate =
    (Id, emailTemplate, navigate) => async (dispatch) => {
        apiConfig
            .put(apiBaseURL.EMAIL_TEMPLATES + "/" + Id, emailTemplate)
            .then((response) => {
                dispatch({
                    type: emailTemplatesActionType.EDIT_EMAIL_TEMPLATE,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "email-template.success.edit.message"
                        ),
                    })
                );
                navigate("/app/email-templates");
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

export const activeInactiveEmail = (Id) => async (dispatch) => {
    apiConfig
        .post(apiBaseURL.EMAIL_TEMPLATES_STATUS + "/" + Id)
        .then((response) => {
            dispatch({
                type: emailTemplatesActionType.SET_ACTIVE_DE_ACTIVE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "email.status.edit.success.message"
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
