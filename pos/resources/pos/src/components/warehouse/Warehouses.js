import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import { fetchWarehouses } from '../../store/action/warehouseAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteWarehouse from './DeleteWarehouse';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Warehouses = ( props ) => {
    const { fetchWarehouses, warehouses, totalRecord, isLoading, allConfigData } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const navigate = useNavigate();

    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    const onChange = ( filter ) => {
        fetchWarehouses( filter, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id
        navigate( `/app/warehouse/edit/${id}` )
    };

    const goToProductDetailPage = ( id ) => {
        navigate( `/app/warehouse/detail/${id}` )
    };

    const itemsValue = warehouses.length >= 0 && warehouses.map( warehouse => ( {
        date: getFormattedDate( warehouse.attributes.created_at, allConfigData && allConfigData ),
        time: moment( warehouse.attributes.created_at ).format( 'LT' ),
        name: warehouse.attributes.name,
        phone: warehouse.attributes.phone,
        country: warehouse.attributes.country,
        city: warehouse.attributes.city,
        email: warehouse.attributes.email,
        zip_code: warehouse.attributes.zip_code,
        id: warehouse.id
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'globally.detail.warehouse' ),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
            cell: row => {
                return <div>
                    <div className='text-primary'>{row.name}</div>
                    <div>{row.email}</div>
                </div>
            }
        },
        {
            name: getFormattedMessage( 'globally.input.phone-number.label' ),
            selector: row => row.phone,
            sortField: 'phone',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.input.country.label' ),
            selector: row => row.country,
            sortField: 'country',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.input.city.label' ),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'warehouse.input.zip-code.label' ),
            selector: row => row.zip_code,
            sortField: 'zip_code',
            sortable: true,
        },
        {
            name: getFormattedMessage( 'globally.react-table.column.created-date.label' ),
            selector: row => row.date,
            sortField: 'created_at',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        {row.date}
                    </span>
                )
            }

        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton isViewIcon={true} item={row} goToDetailScreen={goToProductDetailPage}
                goToEditProduct={goToEditProduct} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'warehouse.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                ButtonValue={getFormattedMessage( 'warehouse.create.title' )} totalRows={totalRecord}
                to='#/app/warehouse/create' />
            <DeleteWarehouse onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { warehouses, totalRecord, isLoading, allConfigData } = state;
    return { warehouses, totalRecord, isLoading, allConfigData }
};

export default connect( mapStateToProps, { fetchWarehouses } )( Warehouses );

