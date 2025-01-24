import React from 'react';
import { useSelector } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import TodaySalePurchaseCount from './TodaySalePurchaseCount';
import RecentSale from './RecentSale';
import TopSellingProduct from './TopSellingProduct';
import { placeholderText } from '../../shared/sharedMethod';
import ThisWeekSalePurchaseChart from "./ThisWeekSalePurchaseChart";
import StockAlert from "./StockAlert";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Dashboard = () => {
    const { frontSetting } = useSelector( state => state );

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'dashboard.title' )} />
            <TodaySalePurchaseCount frontSetting={frontSetting} />
            <ThisWeekSalePurchaseChart frontSetting={frontSetting} />
            <TopSellingProduct frontSetting={frontSetting} />
            <RecentSale frontSetting={frontSetting} />
            <StockAlert frontSetting={frontSetting} />
        </MasterLayout>
    )
}

export default Dashboard;
