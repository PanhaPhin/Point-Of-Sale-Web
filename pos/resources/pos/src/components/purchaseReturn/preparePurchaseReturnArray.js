
export const preparePurchaseReturnArray = (products) => {
    let purchaseProductRowArray = [];
    products.forEach(product => {
        purchaseProductRowArray.push({
            name: product.attributes.name,
            code: product.attributes.code,
            stock: product.attributes.stock && product.attributes.stock.quantity,
            short_name: product.attributes.purchase_unit_name.short_name,
            product_unit: product.attributes.product_unit,
            product_id: product.id,
            product_cost: product.attributes.product_cost,
            net_unit_cost: product.attributes.product_cost,
            fix_net_unit: product.attributes.product_cost,
            tax_type: product.attributes.tax_type,
            tax_value: product.attributes.order_tax ? product.attributes.order_tax : 0.00,
            tax_amount: 0.00,
            discount_type: '2',
            discount_value: 0.00,
            discount_amount: 0.00,
            purchase_unit: product.attributes.purchase_unit,
            quantity: 1,
            sub_total: 0.00,
            id: product.id,
            purchase_return_item_id: ''
        })
    });
    return purchaseProductRowArray;
};
