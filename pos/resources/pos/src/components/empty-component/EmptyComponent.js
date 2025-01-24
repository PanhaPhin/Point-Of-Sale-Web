import React from 'react';
import { getFormattedMessage } from '../../shared/sharedMethod';
import Spinner from "../../shared/components/loaders/Spinner";

const EmptyComponent = (props) => {
    const { isLoading } = props;

    return (
        <>
            {isLoading ? <Spinner /> :
                <div
                    className='px-3 py-6 text-center'>
                    {getFormattedMessage('react-data-table.no-record-found.label')}
                </div>
            }
        </>
    );
};

export default EmptyComponent;
