import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { currencySymbolHendling } from "../sharedMethod";

const ProfitLossWidget = ( props ) => {
    const { title, value, currency, icon, className, moreText, allConfigData } = props;

    const renderTooltip = ( props ) => (
        <Tooltip id="button-tooltip" {...props}>
            {currency} {value}
        </Tooltip>
    );

    return (
        <div className={`col-xxl-4 col-xl-4 text-center col-sm-6 widget`}>
            <div
                className={`${className} shadow-md rounded-10 d-flex align-items-center justify-content-center p-xxl-10 px-7 py-10 my-3 mb-0`}>
                <div className="text-white">
                    <div
                        className={`d-flex mb-2 align-items-center justify-content-center rounded-10`}>
                        {icon}
                    </div>
                    <h3 className="mb-2 text-center fs-4 fw-light">{title}</h3>

                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}>
                        <h2 className="fs-1-xxl text-center fw-bolder text-white">{currencySymbolHendling( allConfigData, currency, value, true )}</h2>
                    </OverlayTrigger>
                </div>
            </div>
            {moreText ? <div className='profit-loss'>
                <p className={'m-0'}>{moreText}</p>
            </div> : ''}
        </div>
    )
};
export default ProfitLossWidget;
