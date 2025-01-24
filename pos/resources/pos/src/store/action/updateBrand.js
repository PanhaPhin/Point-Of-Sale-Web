import {constants} from '../../constants';

export const callUpdateBrandApi = (isCall) => {
    return {type: constants.CALL_UPDATE_BRAND_API, payload: isCall};
};
