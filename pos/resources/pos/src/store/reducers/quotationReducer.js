import {quotationActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case quotationActionType.FETCH_QUOTATIONS:
            return action.payload;
        case quotationActionType.FETCH_QUOTATION:
            return action.payload;
        case quotationActionType.ADD_QUOTATION:
            return action.payload;
        case quotationActionType.EDIT_QUOTATION:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case quotationActionType.DELETE_QUOTATION:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
