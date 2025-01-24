import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const TopSellingProductChart = ( props ) => {
  const { yearTopProduct } = props
  const allQuantity = yearTopProduct ? yearTopProduct.total_quantity : [];
  const allName = yearTopProduct ? yearTopProduct.name : [];
  const [ allData, setAllData ] = useState( [] )

  useEffect( () => {
    if ( allQuantity && allName ) {
      countDatas()
    }
  }, [ yearTopProduct ] )

  const countDatas = () => {
    if ( allData.length === 0 ) {
      allQuantity.map( ( value, i ) => {
        setAllData( ( oldValue ) => [ ...oldValue, {
          value: allQuantity[ i ],
          name: allName[ i ]
        } ] );
      } )
    } else if ( allData.length >= 1 ) {
      setAllData( [] )
      allQuantity.map( ( value, i ) => {
        setAllData( ( oldValue ) => [ ...oldValue, {
          value: allQuantity[ i ],
          name: allName[ i ]
        } ] );
      } )
    }
  }

  const option = {
    title: {
      text: '',
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '50%',
        data: allData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 400 }}
    />
  );
};

export default TopSellingProductChart;
