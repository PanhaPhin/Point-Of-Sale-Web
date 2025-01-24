import {constants} from '../../constants';

export const setLoading = (isLoad) => {
    return {type: constants.IS_LOADING, payload: isLoad};
};
