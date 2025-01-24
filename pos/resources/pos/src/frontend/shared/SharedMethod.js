//count discount on price
export const calculateDiscount = ( totalCost ) => {
    if ( totalCost.discount_value > 0 && totalCost.discount_type === '2' || totalCost.discount_type === 2 ) {
        totalCost = ( +totalCost.net_unit_cost - Number( totalCost.discount_value ) )
    } else if ( totalCost.discount_value > 0 && totalCost.discount_type === '1' || totalCost.discount_type === 1 ) {
        const percentDiscount = totalCost.discount_type === '1' || totalCost.discount_type === 1 ? parseFloat( totalCost.net_unit_cost ).toFixed( 2 ) * Number( totalCost.discount_value ) / Number( 100 ) : 0;
        totalCost = ( +totalCost.net_unit_cost - ( percentDiscount ) );
    }
    return totalCost;
};

//count tax on price
export const calculateTax = ( totalCost, finalCount ) => {
    if ( totalCost.tax_type === '2' || totalCost.tax_type === 2 ) {
        totalCost = +finalCount
    } else if ( totalCost.tax_type === '1' || totalCost.tax_type === 1 ) {
        let exclusiveTax = totalCost.tax_type === '1' || totalCost.tax_type === 1 ? parseFloat( finalCount ).toFixed( 2 ) * Number( totalCost.tax_value ) / Number( 100 ) : 0;
        totalCost = ( +finalCount + ( exclusiveTax ) );
    }
    return totalCost;
};

//cart price updated
export const calculateProductCost = ( product ) => {
    let finalCount = 0;
    finalCount = calculateDiscount( product );
    finalCount = calculateTax( product, finalCount );
    return +finalCount;
};
