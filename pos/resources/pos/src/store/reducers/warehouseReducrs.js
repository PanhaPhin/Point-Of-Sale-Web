import {warehouseActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case warehouseActionType.FETCH_WAREHOUSES:
            return action.payload;
        case warehouseActionType.FETCH_WAREHOUSE:
            return [action.payload];
        case warehouseActionType.ADD_WAREHOUSE:
            return action.payload;
        case warehouseActionType.EDIT_WAREHOUSE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case warehouseActionType.DELETE_WAREHOUSE:
            return state.filter(item => item.id !== action.payload);
        case warehouseActionType.FETCH_ALL_WAREHOUSES:
            return action.payload;
        default:
            return state;
    }
};
