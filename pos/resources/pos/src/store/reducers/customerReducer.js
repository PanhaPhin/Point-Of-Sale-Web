import {customerActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case customerActionType.FETCH_CUSTOMERS:
            return action.payload;
        case customerActionType.FETCH_CUSTOMER:
            return [action.payload];
        case customerActionType.ADD_CUSTOMER:
            return action.payload;
        case customerActionType.EDIT_CUSTOMER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case customerActionType.DELETE_CUSTOMER:
            return state.filter(item => item.id !== action.payload);
        case customerActionType.FETCH_ALL_CUSTOMER:
            return action.payload;
        default:
            return state;

    }
};
