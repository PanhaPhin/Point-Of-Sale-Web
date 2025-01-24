import {constants} from '../../constants';

export const setProductUnitId = (id) => {
    return {type: constants.SET_PRODUCT_UNIT_ID, payload: id};
};
