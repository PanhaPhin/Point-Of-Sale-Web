import {saleActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleActionType.FETCH_SALES:
            return action.payload;
        case saleActionType.FETCH_SALE:
            return action.payload;
        case saleActionType.ADD_SALE:
            return action.payload;
        case saleActionType.EDIT_SALE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case saleActionType.DELETE_SALE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
