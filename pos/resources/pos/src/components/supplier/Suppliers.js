import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchSuppliers } from '../../store/action/supplierAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteSupplier from './DeleteSupplier';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ImportSuppliersModel from './ImportSuppliersModel'

const Suppliers = ( props ) => {
    const { fetchSuppliers, suppliers, totalRecord, isLoading, allConfigData } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const [ importSuppliers, setImportSuppliers ] = useState( false );

    const handleClose = () => {
        setImportSuppliers( !importSuppliers );
    };
    const navigate = useNavigate()

    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    const onChange = ( filter ) => {
        fetchSuppliers( filter, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id
        navigate( `/app/suppliers/edit/${id}` )
    };

    const itemsValue = suppliers.length >= 0 && suppliers.map( supplier => ( {
        date: getFormattedDate( supplier.attributes.created_at, allConfigData && allConfigData ),
        time: moment( supplier.attributes.created_at ).format( 'LT' ),
        name: supplier.attributes.name,
        phone: supplier.attributes.phone,
        country: supplier.attributes.country,
        city: supplier.attributes.city,
        email: supplier.attributes.email,
        id: supplier.id
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'supplier.title' ),
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
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
            cell: row => <ActionButton item={row} goToEditProduct={goToEditProduct} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'suppliers.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                ButtonValue={getFormattedMessage( 'supplier.create.title' )} buttonImport={true} goToImport={handleClose}
                totalRows={totalRecord} importBtnTitle={'suppliers.import.title'}
                to='#/app/suppliers/create' />
            <DeleteSupplier onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            {importSuppliers && <ImportSuppliersModel handleClose={handleClose} show={importSuppliers} />}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { suppliers, totalRecord, isLoading, allConfigData } = state;
    return { suppliers, totalRecord, isLoading, allConfigData }
};

export default connect( mapStateToProps, { fetchSuppliers } )( Suppliers );

