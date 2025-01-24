import {constants} from '../../constants';

export const callSaleApi = (isCall) => {
    return {type: constants.CALL_SALE_API, payload: isCall};
};
