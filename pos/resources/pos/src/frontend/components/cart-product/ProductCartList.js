import React from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect, useDispatch} from 'react-redux';
import {currencySymbolHendling, decimalValidate, getFormattedMessage} from '../../../shared/sharedMethod';
import {calculateProductCost} from '../../shared/SharedMethod';
import {addToast} from "../../../store/action/toastAction";
import {toastType} from "../../../constants";

const ProductCartList = (props) => {
    const {
        singleProduct,
        index,
        onClickUpdateItemInCart,
        onDeleteCartItem,
        frontSetting,
        setUpdateProducts,
        posAllProducts, allConfigData
    } = props;
    const dispatch = useDispatch()
    const totalQty = posAllProducts.filter((product) => product.id === singleProduct.id).map((product) => product.attributes.stock.quantity);

    const handleIncrement = () => {
        setUpdateProducts(updateProducts =>
            updateProducts.map((item) => {
                if (item.id === singleProduct.id) {
                    if (item.quantity >= totalQty[0]) {
                        dispatch(addToast({
                            text: getFormattedMessage('pos.product-quantity-error.message'),
                            type: toastType.ERROR
                        }))
                        return item
                    } else {
                        return {...item, quantity: item.quantity++ + 1}
                    }
                } else {
                    return item
                }
            })
        )
    };

    const handleDecrement = () => {
        if (singleProduct.quantity - 1 > 0.00) {
            setUpdateProducts(updateProducts => updateProducts.map(item => item.id === singleProduct.id
                ? {...item, quantity: item.quantity-- - 1}
                : item,
            ))
        }
    };

    //qty onChange
    const handleChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }

        setUpdateProducts(updateProducts =>
            updateProducts.map((item) => {
                if (item.id === singleProduct.id) {
                    if (totalQty[0] < Number(e.target.value)) {
                        dispatch(addToast({
                            text: getFormattedMessage('pos.product-quantity-error.message'),
                            type: toastType.ERROR
                        }))
                        return {...item, quantity: totalQty[0]}
                    } else {
                        return {
                            ...item, quantity: Number(e.target.value)
                        }
                    }
                } else {
                    return item
                }
            })
        )
    };

    return (
        <tr key={index} className='align-middle'>
            <td className='text-nowrap text-nowrap ps-0'>
                <h4 className='product-name text-gray-900 mb-1 text-capitalize text-truncate'>{singleProduct.name}</h4>
                <span className='product-sku'>
                    <span className="badge bg-light-info sku-badge">{singleProduct.code}</span>
                    <i className="bi bi-pencil-fill text-gray-600 ms-2 cursor-pointer fs-small"
                       onClick={() => onClickUpdateItemInCart(singleProduct)}/>
                </span>
            </td>
            <td>
                <div className='counter d-flex align-items-center pos-custom-qty'>
                    <Button type='button' variant='primary' onClick={() => handleDecrement()}
                            className='counter__down d-flex align-items-center justify-content-center'>-</Button>
                    <input type='text' value={singleProduct.quantity}
                           className="hide-arrow"
                           onKeyPress={(event) => decimalValidate(event)}
                           onChange={(e) => handleChange(e)}/>
                    <Button type='button' variant='primary' onClick={() => handleIncrement()}
                            className='counter__up d-flex align-items-center justify-content-center'>+</Button>
                </div>
            </td>
            <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, calculateProductCost(singleProduct))}</td>
            <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, ((calculateProductCost(singleProduct)) * singleProduct.quantity))}</td>
            <td className='text-end remove-button pe-0'>
                <Button className='p-0 bg-transparent border-0' onClick={() => onDeleteCartItem(singleProduct.id)}>
                    <i className='bi bi-trash3 text-danger'/>
                </Button>
            </td>
        </tr>
    )
};

export default connect(null, null)(ProductCartList)
