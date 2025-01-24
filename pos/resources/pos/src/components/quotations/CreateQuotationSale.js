import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAllCustomer} from '../../store/action/customerAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import status from '../../shared/option-lists/status.json';
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchQuotation, editQuotation } from '../../store/action/quotationAction';
import SalesForm from '../sales/SalesForm';
import { addSale } from '../../store/action/salesAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const CreateQuotationSale = (props) => {
    const {fetchQuotation, quotations, customers, fetchAllCustomer, warehouses, fetchAllWarehouses, isLoading, addSale} = props;
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCustomer();
        fetchAllWarehouses();
        fetchQuotation(id)
    }, []);

    const addSaleData = (formValue) => {
        addSale(formValue, navigate);
    };


    const selectedStatus = quotations && quotations.attributes && quotations.attributes.status && status.filter((item) => item.value === quotations.attributes.status)

    const itemsValue = quotations && quotations.attributes && {
        date: quotations.attributes.date,
        warehouse_id: {
            value: quotations.attributes.warehouse_id,
            label: quotations.attributes.warehouse_name,
        },
        customer_id: {
            value: quotations.attributes.customer_id,
            label: quotations.attributes.customer_name,
        },
        tax_rate: quotations.attributes.tax_rate,
        tax_amount: quotations.attributes.tax_amount,
        discount: quotations.attributes.discount,
        shipping: quotations.attributes.shipping,
        grand_total: quotations.attributes.grand_total,
        amount: quotations.attributes.amount,
        quotation_id: id,
        sale_items: quotations.attributes.quotation_items.map((item) => ({
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit.short_name && item.sale_unit.short_name,
            stock_alert:  item.product && item.product.stock_alert,
            product_price: item.product_price,
            fix_net_unit: item.product_price,
            net_unit_price: item.product_price,
            tax_type: item.tax_type,
            tax_value: item.tax_value,
            tax_amount: item.tax_amount,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            isEdit: true,
            stock: item.product && item.product.stocks.filter(item => item.warehouse_id === quotations.attributes.warehouse_id),
            sub_total: item.sub_total,
            sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
            quantity: item.quantity,
            id: item.id,
            quotation_item_id: item.id,
            newItem: '',
        })),
        id: quotations.id,
        notes: quotations.attributes.note,
        status_id: {
            label: selectedStatus && selectedStatus[0] && selectedStatus[0].label,
            value: selectedStatus && selectedStatus[0] && selectedStatus[0].value
        }
    };

    return (
        <MasterLayout>
            <TopProgressBar/>
            <HeaderTitle title={getFormattedMessage("sale.create.title")} to='/app/quotations'/>
            {isLoading ? <Spinner /> :
                <SalesForm singleSale={itemsValue} id={id} addSaleData={addSaleData} isQuotation={true} customers={customers} warehouses={warehouses}/>}
        </MasterLayout>
    )
};


const mapStateToProps = (state) => {
    const {customers, warehouses, isLoading, quotations} = state;
    return {customers, warehouses, isLoading, quotations}
};

export default connect(mapStateToProps, {fetchQuotation, editQuotation, fetchAllCustomer, fetchAllWarehouses, addSale})(CreateQuotationSale);
