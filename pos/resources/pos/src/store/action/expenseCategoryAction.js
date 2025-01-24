import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    expenseCategoriesActionType,
    toastType,
} from "../../constants";
import { addToast } from "./toastAction";
import {
    removeFromTotalRecord,
    setTotalRecord,
    addInToTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchExpenseCategories =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.EXPENSES_CATEGORIES;
        if (
            !_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search || filter.order_By)
        ) {
            url += requestParam(filter, null, null, null, url);
        }
        apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: expenseCategoriesActionType.FETCH_EXPENSES_CATEGORIES,
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

export const fetchExpenseCategory =
    (expensesId, singleExpense) => async (dispatch) => {
        apiConfig
            .get(
                apiBaseURL.EXPENSES_CATEGORIES + "/" + expensesId,
                singleExpense
            )
            .then((response) => {
                dispatch({
                    type: expenseCategoriesActionType.FETCH_EXPENSE_CATEGORIES,
                    payload: response.data.data,
                });
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

export const addExpenseCategory = (expenses) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.EXPENSES_CATEGORIES, expenses)
        .then((response) => {
            dispatch({
                type: expenseCategoriesActionType.ADD_EXPENSE_CATEGORIES,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "expense-category.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editExpenseCategory =
    (expensesId, expenses) => async (dispatch) => {
        apiConfig
            .put(apiBaseURL.EXPENSES_CATEGORIES + "/" + expensesId, expenses)
            .then((response) => {
                dispatch({
                    type: expenseCategoriesActionType.EDIT_EXPENSE_CATEGORIES,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "expense-category.success.edit.message"
                        ),
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

export const deleteExpenseCategory = (expensesId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.EXPENSES_CATEGORIES + "/" + expensesId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: expenseCategoriesActionType.DELETE_EXPENSE_CATEGORIES,
                payload: expensesId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "expense-category.success.delete.message"
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

export const fetchAllExpenseCategories = () => async (dispatch) => {
    apiConfig
        .get(`expense-categories?page[size]=0`)
        .then((response) => {
            dispatch({
                type: expenseCategoriesActionType.FETCH_ALL_EXPENSES_CATEGORIES,
                payload: response.data.data,
            });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
