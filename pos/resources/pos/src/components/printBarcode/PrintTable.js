import React, { useEffect, useState } from 'react';
import { decimalValidate, getFormattedMessage } from '../../shared/sharedMethod';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const PrintTable = ( props ) => {
    const { setUpdateProducts, updateProducts, printBarcodeValue } = props;
    const [ qty, setQty ] = useState( 10 )
    const dispatch = useDispatch()
    const [ productId, setProductId ] = useState( 0 )

    const handleChange = ( e, singleProduct ) => {
        setQty( e.target.value );
        setProductId( singleProduct )
        dispatch( { type: "UPDATE_PRINT_QTY", payload: e.target.value } )
    };

    const onDeleteCartItem = ( id ) => {
        setUpdateProducts( updateProducts => updateProducts.filter( ( item ) => item.id !== id ) );
    };

    useEffect( () => {
        let findProduct = updateProducts.find( items => items.id === productId )
        setUpdateProducts( updateProducts => updateProducts.map( item => item.id === findProduct?.id
            ? { ...item, quantity: Number( qty ) }
            : item,
        ) )
    }, [ qty ] )

    return (
        <tbody>
            {printBarcodeValue.warehouse_id && updateProducts && updateProducts.length >= 1 ? updateProducts.map( ( singleProduct, index ) => {
                return (
                    <tr key={index} className='align-middle'>
                        <td className='ps-3'>
                            <h4 className='fs-6 mb-1'>{singleProduct.code}</h4>
                            <div className='d-flex align-items-center'>
                                <span className='badge bg-light-success'>
                                    <span>{singleProduct.name}</span>
                                </span>
                            </div>
                        </td>
                        <td>
                            <input aria-label='Product Quantity' className='form-control width-320'
                                onKeyPress={( event ) => decimalValidate( event )} value={singleProduct.quantity}
                                onChange={( e ) => handleChange( e, singleProduct.id )}
                            />
                        </td>
                        <td className='text-start'>
                            <button className='btn px-4 text-danger fs-3'>
                                <FontAwesomeIcon icon={faTrash} onClick={() => onDeleteCartItem( singleProduct.id )} />
                            </button>
                        </td>
                    </tr> )
            } ) :
                <tr>
                    <td colSpan={8} className='fs-5 px-3 py-6 custom-text-center'>
                        {getFormattedMessage( 'sale.product.table.no-data.label' )}
                    </td>
                </tr>}
        </tbody> )

};
export default PrintTable;
