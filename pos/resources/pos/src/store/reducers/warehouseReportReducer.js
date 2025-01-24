import {warehouseActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case warehouseActionType.FETCH_WAREHOUSE_REPORT:
            return action.payload;
        default:
            return state;
    }
};
