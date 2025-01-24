import apiConfig from "../../config/apiConfig";
import { apiBaseURL, expenseActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchExpenses =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.EXPENSES;
        if (
            !_.isEmpty(filter) &&
            (filter.page ||
                filter.pageSize ||
                filter.search ||
                filter.order_By ||
                filter.created_at)
        ) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: expenseActionType.FETCH_EXPENSES,
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

export const fetchExpense = (expenseId, singleExpense) => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.EXPENSES + "/" + expenseId, singleExpense)
        .then((response) => {
            dispatch({
                type: expenseActionType.FETCH_EXPENSE,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const addExpense = (expense, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.EXPENSES, expense)
        .then((response) => {
            dispatch({
                type: expenseActionType.ADD_EXPENSE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("expense.success.create.message"),
                })
            );
            navigate("/app/expenses");
            dispatch(addInToTotalRecord(1));
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editExpense =
    (expenseId, expense, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        apiConfig
            .put(apiBaseURL.EXPENSES + "/" + expenseId, expense)
            .then((response) => {
                dispatch({
                    type: expenseActionType.EDIT_EXPENSE,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "expense.success.edit.message"
                        ),
                    })
                );
                navigate("/app/expenses");
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const deleteExpense = (expenseId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.EXPENSES + "/" + expenseId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: expenseActionType.DELETE_EXPENSE,
                payload: expenseId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("expense.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
