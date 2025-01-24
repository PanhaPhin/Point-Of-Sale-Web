import {constants} from '../../constants';

export const callImportProductApi = (isCall) => {
    return {type: constants.CALL_IMPORT_PRODUCT_API, payload: isCall};
};
