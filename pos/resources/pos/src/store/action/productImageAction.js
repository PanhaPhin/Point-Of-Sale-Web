import apiConfig from '../../config/apiConfig';
import {apiBaseURL, productImageActionType, toastType} from '../../constants';
import {removeFromTotalRecord} from './totalRecordAction';
import {addToast} from './toastAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

export const deleteProductImage = (imageId) => async (dispatch) => {
    apiConfig.delete(apiBaseURL.PRODUCT_IMAGE_DELETE + '/' + imageId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({type: productImageActionType.DELETE_PRODUCT_IMAGE, payload: imageId});
            dispatch(addToast({text: getFormattedMessage('product.image.success.delete.message')}));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
