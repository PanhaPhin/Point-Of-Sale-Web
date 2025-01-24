import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';
import { Tokens } from '../constants';
import moment from "moment";

export const getAvatarName = ( name ) => {
    if ( name ) {
        return name.toLowerCase()
            .split( ' ' )
            .map( ( s ) => s.charAt( 0 ).toUpperCase() )
            .join( '' );
    }
};

export const numValidate = ( event ) => {
    if ( !/[0-9]/.test( event.key ) ) {
        event.preventDefault();
    }
};

export const getFormattedMessage = ( id ) => {
    return <FormattedMessage id={id} defaultMessgae={id} />
};

export const getFormattedOptions = ( options ) => {
    const intl = useIntl();
    const copyOptions = _.cloneDeep( options );
    copyOptions.map( option => option.name = intl.formatMessage( {
        id: option.name,
        defaultMessage: option.name
    } ) );
    return copyOptions;
};

export const placeholderText = ( label ) => {
    const intl = useIntl();
    const placeholderLabel = intl.formatMessage( { id: label } );
    return placeholderLabel
}

export const decimalValidate = ( event ) => {
    if ( !/^\d*\.?\d*$/.test( event.key ) ) {
        event.preventDefault();
    }
};

export const addRTLSupport = ( rtlLang ) => {
    const html = document.getElementsByTagName( "html" )[ 0 ];
    const att = document.createAttribute( "dir" );
    att.value = "rtl";
    if ( rtlLang === "ar" ) {
        html.setAttributeNode( att );
    } else {
        html.removeAttribute( "dir" );
    }
}

export const onFocusInput = ( el ) => {
    if ( el.target.value === '0.00' ) {
        el.target.value = '';
    }
};

export const ProtectedRoute = ( props ) => {
    const { children, allConfigData, route } = props;
    const token = localStorage.getItem( Tokens.ADMIN )
    if ( !token || token === null ) {
        return <Navigate to='/login' replace={true} />;
    } else {
        if ( allConfigData?.open_register ) {
            if ( route === "pos" ) {
                return <Navigate to='/app/dashboard' replace={true} />
            } else {
                return children;
            }
        } else {
            return children;
        }
    }
};

export const formatAmount = ( num ) => {
    if ( num >= 1000000000 ) {
        return ( num / 1000000000 ).toFixed( 1 ).replace( /\.0$/, '' ) + 'B';
    }
    if ( num >= 1000000 ) {
        return ( num / 1000000 ).toFixed( 1 ).replace( /\.0$/, '' ) + 'M';
    }
    if ( num >= 1000 ) {
        return ( num / 1000 ).toFixed( 1 ).replace( /\.0$/, '' ) + 'K';
    }
    return num;
}

export const currencySymbolHendling = ( isRightside, currency, value, is_forment ) => {
    if ( isRightside?.is_currency_right === 'true' ) {
        if ( is_forment ) {
            return formatAmount( value ) + ' ' + currency
        } else {
            return parseFloat( value ).toFixed( 2 ) + ' ' + currency
        }
    } else {
        if ( is_forment ) {
            return currency + ' ' + formatAmount( value )
        } else {
            return currency + ' ' + parseFloat( value ).toFixed( 2 )
        }
    }
}

export const getFormattedDate = ( date, config ) => {
    const format = config && config.date_format
    if ( format === "d-m-y" ) {
        return moment( date ).format( 'DD-MM-YYYY' )
    } else if ( format === "m-d-y" ) {
        return moment( date ).format( "MM-DD-YYYY" )
    } else if ( format === "y-m-d" ) {
        return moment( date ).format( "YYYY-MM-DD" )
    } else if ( format === "m/d/y" ) {
        return moment( date ).format( "MM/DD/YYYY" )
    } else if ( format === "d/m/y" ) {
        return moment( date ).format( "DD/MM/YYYY" )
    } else if ( format === "y/m/d" ) {
        return moment( date ).format( "YYYY/MM/DD" )
    } else if ( format === "m.d.y" ) {
        return moment( date ).format( "MM.DD.YYYY" )
    } else if ( format === "d.m.y" ) {
        return moment( date ).format( "DD.MM.YYYY" )
    } else if ( format === "y.m.d" ) {
        return moment( date ).format( "YYYY.MM.DD" )
    } else moment( date ).format( 'YYYY-MM-DD' )
}
