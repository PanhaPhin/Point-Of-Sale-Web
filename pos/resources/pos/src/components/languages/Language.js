import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import MasterLayout from '../MasterLayout';
import { fetchLanguages } from '../../store/action/languageAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import DeleteLanguage from './DeleteLanguage';
import EditLanguage from './EditLanguage';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import CreateLanguage from "./CreateLanguage";

const Languages = ( props ) => {
    const { fetchLanguages, languages, totalRecord, isLoading } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const [ editModel, setEditModel ] = useState( false );
    const [ language, setLanguage ] = useState();

    const handleClose = ( item ) => {
        setEditModel( !editModel );
        setLanguage( item );
    };

    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    const onChange = ( filter ) => {
        fetchLanguages( filter, false );
    };

    const itemsValue = languages.length >= 0 && languages.map( language => {
        return (
            {
                name: language.attributes?.name,
                iso_code: language.attributes?.iso_code,
                id: language?.id
            }
        )
    } );

    const columns = [
        {
            name: getFormattedMessage( 'globally.input.name.label' ),
            selector: row => row.name,
        },
        {
            name: getFormattedMessage( 'react-data-table.iso-date.column.label' ),
            selector: row => row.iso_code,
        },
        {
            name: getFormattedMessage( "react-data-table.translation.column.label" ),
            cell: row => <Link to={`/app/languages/${row.id}`} className={"text-decoration-none"}>{getFormattedMessage( 'edit-translation.title' )}</Link>
        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={"Languages"} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                AddButton={<CreateLanguage />} title={"Languages"}
                totalRows={totalRecord} />
            <EditLanguage handleClose={handleClose} show={editModel} language={language} />
            <DeleteLanguage onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                onDelete={isDelete} />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { languages, totalRecord, isLoading, allConfigData } = state;
    return { languages, totalRecord, isLoading, allConfigData }
};

export default connect( mapStateToProps, { fetchLanguages } )( Languages );

