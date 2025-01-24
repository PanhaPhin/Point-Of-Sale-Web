import React, {useEffect} from 'react'
import MasterLayout from '../MasterLayout'
import TabTitle from '../../shared/tab-title/TabTitle'
import HeaderTitle from '../header/HeaderTitle'
import {getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import {Image} from 'react-bootstrap-v5';
import {useParams} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {fetchWarehouseDetails} from '../../store/action/warehouseAction';
import user from '../../assets/images/brand_logo.png';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const WarehouseDetail = () => {
    const {id} = useParams();
    const {warehouseDetails} = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchWarehouseDetails(id))
    }, [])

    return (
        <MasterLayout>
            <TopProgressBar/>
            <TabTitle title={placeholderText('warehouse.details.title')}/>
            <HeaderTitle title={getFormattedMessage('warehouse.details.title')} to='/app/warehouse'/>
            <div className='card mt-2 table-responsive'>
                {warehouseDetails.length >= 1 ?
                    <table className="table">
                        <thead>
                        <tr>
                            <th>{getFormattedMessage('product.title')}</th>
                            <th>{getFormattedMessage('globally.detail.quantity')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {warehouseDetails.length >= 1 ? warehouseDetails.map((item, index) => {
                            const img = item.product_image && item.product_image.imageUrls && item.product_image.imageUrls[0]
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <Image src={img ? img : user} alt={item.product_name}
                                                   className="me-2 image image-circle image-mini" height='50'
                                                   width='50'/>
                                            <div className='d-flex flex-column'>
                                                <span>{item.product_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className='badge bg-light-info me-2'><span>{item.quantity}</span></div>
                                             <span className='badge bg-light-success me-2'><span>{item.product_unit_name}</span></span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : ''}
                        </tbody>
                    </table> :
                    <div className='text-center p-5'>
                        <h5>{getFormattedMessage('no-product-found.label')}</h5>
                    </div>}
            </div>
        </MasterLayout>
    )
}


export default WarehouseDetail
