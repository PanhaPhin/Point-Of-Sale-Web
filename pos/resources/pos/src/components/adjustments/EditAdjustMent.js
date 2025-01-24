import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAdjustment} from '../../store/action/adjustMentAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import AdjustmentType from '../../shared/option-lists/AdjustmentType.json';
import AdjustmentForm from './AdjustmentForm';
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const EditAdjustMent = (props) => {
    const {warehouses, fetchAllWarehouses, isLoading, fetchAdjustment, adjustments} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchAllWarehouses();
        fetchAdjustment(id)
    }, []);

    const method_type = adjustments.attributes && adjustments.attributes.adjustment_items && adjustments.attributes.adjustment_items.map((item) => item.method_type)
    const selectedAdjustMentType = adjustments.attributes && adjustments.attributes.adjustment_items && AdjustmentType.filter((item) => item.value === method_type[0])

    const itemsValue = adjustments && adjustments.attributes && {
        date: adjustments.attributes.date,
        warehouse_id: {
            value: adjustments.attributes.warehouse_id,
            label: adjustments.attributes.warehouse_name,
        },
        adjustment_items: adjustments.attributes.adjustment_items.map((item) => ({
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit,
            stock_alert:  item.product && item.product.stock_alert,
            product_price: item.product && item.product.product_price,
            fix_net_unit: item.product && item.product.product_price,
            net_unit_price: item.product && item.product.product_price,
            tax_type: item.product && item.product.tax_type,
            tax_value: item.tax_value,
            tax_amount: item.tax_amount,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            sub_total: item.sub_total,
            sale_unit: item.product && item.product.sale_unit,
            quantity: item.quantity,
            stock: item.product && item.product.stocks.filter(items => items.warehouse_id === adjustments.attributes.warehouse_id),
            id: item.product_id,
            sale_item_id: item.id,
            newItem: '',
            adjustMethod: item.method_type,
            isEdit: true,
            adjustment_item_id: item.id

        })),
        id: adjustments.id,
        notes: adjustments.attributes.note,
        AdjustmentType: {
            label: selectedAdjustMentType && selectedAdjustMentType[0] && selectedAdjustMentType[0].label,
            value: selectedAdjustMentType && selectedAdjustMentType[0] && selectedAdjustMentType[0].value
        }
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('adjustments.edit.title')} to='/app/adjustments'/>
            {isLoading ? <Spinner /> :
                <AdjustmentForm singleAdjustMent={itemsValue} id={id} warehouses={warehouses}/>}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {warehouses, isLoading, adjustments} = state;
    return {warehouses, isLoading, adjustments}
};

export default connect(mapStateToProps, {fetchAllWarehouses, fetchAdjustment})(EditAdjustMent);
