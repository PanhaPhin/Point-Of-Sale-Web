import {yearTopProductActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case yearTopProductActionType.YEAR_TOP_PRODUCT:
            return action.payload;
        default:
            return state;
    }
};
