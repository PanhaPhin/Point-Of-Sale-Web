import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Image, Table} from 'react-bootstrap-v5';
import {useParams} from 'react-router-dom';
import Carousel from 'react-elastic-carousel';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import {fetchProduct} from '../../store/action/productAction';
import HeaderTitle from '../header/HeaderTitle';
import user from '../../assets/images/brand_logo.png';
import {getFormattedMessage, placeholderText, currencySymbolHendling} from '../../shared/sharedMethod';
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const ProductDetail = props => {
    const {products, fetchProduct, isLoading, frontSetting, allConfigData} = props;
    const {id} = useParams();
    const result = products && products.reduce((obj, cur) => ({...obj, [cur.type]: cur}), {})
    const product = result.products

    useEffect(() => {
        fetchProduct(id);
    }, []);

    const sliderImage = product && product.attributes && product.attributes.images.imageUrls && product.attributes.images.imageUrls.map((img) => img)
    const warehouse = product && product.attributes && product.attributes.warehouse && product.attributes.warehouse.map((item) => item)

    return (
        <MasterLayout>
            <TopProgressBar/>
            <HeaderTitle title={getFormattedMessage('product.product-details.title')} to='/app/products'/>
            <TabTitle title={placeholderText('product.product-details.title')}/>
            <div className='card card-body'>
                <div className='row'>
                    {isLoading ?
                        <Spinner /> : <>
                            <div className='col-md-12'>
                                <div className='d-inline-block text-center'>
                                    <Image
                                        src={product && product.attributes && product.attributes.barcode_url}
                                        alt={product && product.attributes && product.attributes.name}
                                        className='product_brcode'/>
                                    <div
                                        className='mt-3'>{product && product.attributes && product.attributes.code}</div>
                                </div>
                            </div>
                            <div className='col-xxl-7'>
                                <table className='table table-responsive gy-7'>
                                    <tbody>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.product-details.code-product.label')}</th>
                                        <td className='py-4'>{product && product.attributes && product.attributes.code}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.title')}</th>
                                        <td className='py-4'>{product && product.attributes && product.attributes.name}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.product-details.category.label')}</th>
                                        <td className='py-4'> {product && product.attributes && product.attributes.product_category_name}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.input.brand.label')}</th>
                                        <td className='py-4'>{product && product.attributes && product.attributes.brand_name}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.product-details.cost.label')}</th>
                                        <td className='py-4'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, product && product.attributes && product.attributes.product_cost)}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.table.price.column.label')}</th>
                                        <td className='py-4'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, product && product.attributes && product.attributes.product_price)}</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.product-details.unit.label')}</th>
                                        {product && product.attributes && product.attributes.product_unit_name &&
                                        <td className='py-4'><span className='badge bg-light-success'><span>{product.attributes.product_unit_name?.name}</span></span></td>}
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.product-details.tax.label')}</th>
                                        <td className='py-4'>{product && product.attributes && product.attributes.order_tax ? product.attributes.order_tax : 0} %</td>
                                    </tr>
                                    <tr>
                                        <th className='py-4' scope='row'>{getFormattedMessage('product.input.stock-alert.label')}</th>
                                        <td className='py-4'>{product && product.attributes && product.attributes.stock_alert}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='col-xxl-5 d-flex justify-content-center m-auto'>
                                {sliderImage && sliderImage.length !== 0 ? <Carousel>
                                    {sliderImage.length !== 0 && sliderImage.map((img, i) => {
                                        return (<div key={i}>
                                            <Image src={img} width='413px'/>
                                        </div>)
                                    })}
                                </Carousel> : <div>
                                    <Image src={user} width='413px'/>
                                </div>}
                            </div>
                        </>}
                </div>
            </div>
            {warehouse && warehouse.length !== 0 ?
             <div className='card card-body mt-2'>
             <div>
                <Table responsive="md">
                    <thead>
                        <tr>
                            <th>{getFormattedMessage('dashboard.stockAlert.warehouse.label')}</th>
                            <th>{getFormattedMessage('dashboard.stockAlert.quantity.label')}</th>
                        </tr>
                    </thead>
                    <tbody>
                       {warehouse && warehouse.map((item, index) => {
                        return(
                            <tr key={index}>
                                <td className='py-4'>{item.name}</td>
                                <td className='py-4'>
                                    <div>
                                        <div className='badge bg-light-info me-2'><span>{item.total_quantity}</span></div>
                                        {product.attributes.product_unit === '1' && <span className='badge bg-light-success me-2'><span>{getFormattedMessage("unit.filter.piece.label")}</span></span>
                                        || product.attributes.product_unit === '2' && <span className='badge bg-light-primary me-2'><span>{getFormattedMessage("unit.filter.meter.label")}</span></span>
                                        || product.attributes.product_unit === '3' && <span className='badge bg-light-warning me-2'><span>{getFormattedMessage("unit.filter.kilogram.label")}</span></span>}
                                    </div>
                                </td>
                            </tr>
                        )
                       })}
                    </tbody>
                </Table>
               </div>
                </div> : ''
        }
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {products, isLoading, frontSetting, allConfigData} = state;
    return {products, isLoading, frontSetting, allConfigData}
};

export default connect(mapStateToProps, {fetchProduct})(ProductDetail);
