export const prepareCartArray = products => {
    let cartProductRowArray = [];
    products.forEach(product => {
        cartProductRowArray.push({
            name: product.attributes.name,
            code: product.attributes.code,
            stock_alert: product.attributes.stock_alert,
            product_id: product.id,
            product_cost: product.attributes.product_cost,
            net_unit_cost: product.attributes.product_price,
            tax_type: product.attributes.tax_type.value ? Number(product.attributes.tax_type.value) : product.attributes.tax_type,
            product_price: product.attributes.product_price,
            tax_amount: 0,
            discount_type: 1,
            discount_value: 0,
            discount_amount: 0,
            product_unit: product.attributes.product_unit,
            sale_unit: product.attributes.sale_unit,
            quantity: 1,
            sub_total: 0,
            id: product.id,
            sale_id: 1,
            tax_value: product.attributes.order_tax,
            hold_item_id: ''
        })
    });
    return cartProductRowArray;
};
