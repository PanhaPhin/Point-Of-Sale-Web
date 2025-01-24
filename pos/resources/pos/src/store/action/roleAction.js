import { apiBaseURL, rolesActionType, toastType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { addToast } from "./toastAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchRoles =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.ROLES;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, admin, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: rolesActionType.FETCH_ROLES,
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

export const fetchRole =
    (rolesId, singleRole, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.ROLES + "/" + rolesId, singleRole)
            .then((response) => {
                dispatch({
                    type: rolesActionType.FETCH_ROLE,
                    payload: response.data.data,
                });
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

export const addRole = (roles, navigate) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.ROLES, roles)
        .then((response) => {
            dispatch({
                type: rolesActionType.ADD_ROLES,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("role.success.create.message"),
                })
            );
            navigate("/app/roles");
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editRole = (rolesId, role, navigate) => async (dispatch) => {
    await apiConfig
        .patch(apiBaseURL.ROLES + "/" + rolesId, role)
        .then((response) => {
            dispatch({
                type: rolesActionType.EDIT_ROLES,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("role.success.edit.message"),
                })
            );
            navigate("/app/roles");
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteRole = (rolesId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.ROLES + "/" + rolesId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: rolesActionType.DELETE_ROLES, payload: rolesId });
            dispatch(
                addToast({
                    text: getFormattedMessage("role.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const fetchAllRoles = () => async (dispatch) => {
    apiConfig
        .get(`roles?page[size]=0`)
        .then((response) => {
            dispatch({
                type: rolesActionType.FETCH_ALL_ROLES,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
