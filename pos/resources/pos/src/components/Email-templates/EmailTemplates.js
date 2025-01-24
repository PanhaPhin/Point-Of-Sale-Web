import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchEmailTemplates, activeInactiveEmail } from "../../store/action/emailTemplatesAction";

const EmailTemplates = ( props ) => {
    const { totalRecord, isLoading, emailTemplates, fetchEmailTemplates, activeInactiveEmail } = props;

    const navigate = useNavigate();

    const onChange = ( filter ) => {
        fetchEmailTemplates( filter, true );
    };

    const goToEditProduct = ( item ) => {
        const id = item.id
        navigate( `/app/email-templates/${id}` )
    };

    const itemsValue = emailTemplates.length >= 0 && emailTemplates.map( emailTemplate => ( {
        name: emailTemplate.attributes.template_name,
        content: emailTemplate.attributes.content,
        is_active: emailTemplate?.attributes?.status === 0 || emailTemplate?.attributes?.status === false ? false : true,
        id: emailTemplate.id
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'supplier.table.name.column.title' ),
            selector: row => row.name,
            sortField: 'template_name',
            sortable: true,
        },
        {
            name: getFormattedMessage( "purchase.select.status.label" ),
            sortField: 'status',
            cell: row => {
                const content = row.content
                const item = content.replace( /<\/?.+?>/ig, '' );
                return (
                    <div className="d-flex align-items-center mt-4">
                        <label className="form-check form-switch form-switch-sm">
                            <input name="status" data-id="704" className="form-check-input admin-status" type="checkbox"
                                value="1" checked={row.is_active} onChange={() => onChecked( row )} />
                            <span className="switch-slider" data-checked="✓" data-unchecked="✕"></span>
                        </label>
                    </div>
                )
            },
            sortable: false,
        },
        {
            name: getFormattedMessage( "globally.input.content.label" ),
            // selector: row => row.content,
            sortField: 'content',
            cell: row => {
                const content = row.content
                const item = content.replace( /<\/?.+?>/ig, '' );
                return (
                    <div>{item}</div>
                )
            },
            sortable: true,
        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} isDeleteMode={false} goToEditProduct={goToEditProduct} isEditMode={true} />
        }
    ];

    const onChecked = ( row ) => {
        activeInactiveEmail( row.id, row );
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'email-template.title' )} />
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading} totalRows={totalRecord}
                to='#/app/email-templates/create' />
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { totalRecord, isLoading, emailTemplates } = state;
    return { totalRecord, isLoading, emailTemplates }
};

export default connect( mapStateToProps, { fetchEmailTemplates, activeInactiveEmail } )( EmailTemplates );


