import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import { useParams } from 'react-router-dom'
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import { getFormattedMessage, getFormattedOptions } from '../../shared/sharedMethod';
import TransferForm from "./TransferForm";
import { fetchTransfer } from '../../store/action/transfersAction';
import { transferCreatStatusOptions } from '../../constants';

const EditTransfer = ( props ) => {
    const { fetchTransfer, tansfers, warehouses, fetchAllWarehouses, isLoading } = props;
    const { id } = useParams();

    useEffect( () => {
        fetchAllWarehouses();
        fetchTransfer( id );
    }, [] );

    const transferStatusFilterOptions = getFormattedOptions( transferCreatStatusOptions )
    const transferStatusDefaultValue = tansfers.attributes && tansfers.attributes.status && transferStatusFilterOptions.filter( ( item ) => item.id === tansfers.attributes.status )

    const itemsValue = tansfers && tansfers.attributes && {
        date: tansfers.attributes.date,
        warehouse_id: {
            value: tansfers.attributes.from_warehouse_id,
            label: tansfers.attributes.from_warehouse.name,
        },
        from_warehouse_id: {
            value: tansfers.attributes.from_warehouse_id,
            label: tansfers.attributes.from_warehouse.name,
        },
        to_warehouse_id: {
            value: tansfers.attributes.to_warehouse_id,
            label: tansfers.attributes.to_warehouse.name,
        },
        tax_rate: tansfers.attributes.tax_rate,
        tax_amount: tansfers.attributes.tax_amount,
        discount: tansfers.attributes.discount,
        shipping: tansfers.attributes.shipping,
        grand_total: tansfers.attributes.grand_total,
        amount: tansfers.attributes.amount,
        transfer_items: tansfers.attributes.transfer_items.map( ( item ) => ( {
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.short_name,
            stock_alert: item.product && item.product.stock_alert,
            product_price: item.product_price,
            fix_net_unit: item.product_price,
            net_unit_price: item.product_price,
            net_unit_cost: item.product_price,
            tax_type: item.tax_type,
            tax_value: item.tax_value,
            tax_amount: item.tax_amount,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            isEdit: true,
            stock: item.product && item.product.stocks.filter( item => item.warehouse_id === tansfers.attributes.from_warehouse_id ),
            sub_total: item.sub_total,
            sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
            quantity: item.quantity,
            id: item.id,
            transfer_item_id: item.id,
            newItem: '',
            purchase_unit: item.product && item.product.purchase_unit
        } ) ),
        id: tansfers.id,
        notes: tansfers.attributes.note,
        status_id: {
            label: transferStatusDefaultValue[ 0 ] && transferStatusDefaultValue[ 0 ].name,
            value: transferStatusDefaultValue[ 0 ] && transferStatusDefaultValue[ 0 ].id
        },
    };


    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage( 'transfer.edit.title' )} to='/app/transfers' />
            {isLoading ? <div className='text-center custom-loading mx-auto fs-1 fw-bold'>Loading...</div> :
                <TransferForm singleTransfer={itemsValue} id={id} warehouses={warehouses} />}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { warehouses, isLoading, tansfers } = state;
    return { warehouses, isLoading, tansfers }
};

export default connect( mapStateToProps, { fetchAllWarehouses, fetchTransfer } )( EditTransfer );

