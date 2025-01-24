import { apiBaseURL, settingActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import apiConfig from "../../config/apiConfig";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { fetchConfig } from "./configAction";
import { setDateFormat } from "./dateFormatAction";
import { setDefaultCountry } from "../defaultCountryAction";
import { fetchFrontSetting } from "./frontSettingAction";

export const fetchSetting =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.SETTINGS;
        if (!_.isEmpty(filter) && (filter.page || filter.pageSize)) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: settingActionType.FETCH_SETTING,
                    payload: response.data.data,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                response &&
                    dispatch(
                        setDateFormat(response.data.data.attributes.date_format)
                    );
                response &&
                    dispatch(
                        setDefaultCountry({
                            countries: response.data.data.attributes.countries,
                            country: response.data.data.attributes.country,
                        })
                    );
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

export const editSetting =
    (setting, isLoading = true, setDefaultDate) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .post(apiBaseURL.SETTINGS, setting)
            .then((response) => {
                // dispatch({type: settingActionType.EDIT_SETTINGS, payload: response.data.data});
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "settings.success.edit.message"
                        ),
                    })
                );
                dispatch(fetchConfig());
                dispatch(fetchFrontSetting());
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                response &&
                    dispatch(
                        setDateFormat(response.data.data.attributes.date_format)
                    );
                response &&
                    dispatch(
                        setDefaultCountry({
                            countries: response.data.data.attributes.countries,
                            country: response.data.data.attributes.country,
                        })
                    );
                response && dispatch(fetchSetting());
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            });
    };

export const fetchCacheClear = () => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CACHE_CLEAR)
        .then((response) => {
            dispatch({
                type: settingActionType.FETCH_CACHE_CLEAR,
                payload: response.data.message,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "settings.clear-cache.success.message"
                    ),
                })
            );
            window.location.reload();
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const fetchState = (id) => async (dispatch) => {
    apiConfig
        .get("states/" + id)
        .then((response) => {
            dispatch({ type: "FETCH_STATE_DATA", payload: response.data.data });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
