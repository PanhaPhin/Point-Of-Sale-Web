<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.pdf.top_customers_pdf') }}</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css"/>
    <style>
        * {
            font-family: DejaVu Sans, Arial, "Helvetica", Arial, "Liberation Sans", sans-serif;
        }

        @if(getLoginUserLanguage() !='ar')
            .fw-bold {
            font-weight: 500;
            color: #333;
        }

        @else
        .fw-bold {
            /*font-weight: 500;*/
            color: #333;
        }

        @endif

        .fw-light {
            font-weight: 500;
            color: grey;
        }
    </style>

</head>
<body>

<table width="100%">
    <tr>
        <td align="" style="vertical-align: bottom">
            <h2 style="color: dodgerblue;">{{ getLoginUserLanguage() == 'cn' ? '' : __('messages.pdf.top_customers_list') }}</h2>
        </td>
    </tr>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Customer Name' : __('messages.pdf.customer_name') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Phone' : __('messages.pdf.phone') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Email' : __('messages.pdf.email') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Total Sales' :__('messages.pdf.total_sales') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Total Amount' :__('messages.pdf.total_amount') }}</th>
    </tr>
    </thead>
    <tbody style="background-color: #f5f3f3;">
    @if(isset($topCustomers))
        @foreach($topCustomers  as $customer)
            <tr align="center" style="border-bottom: 2px solid darkgrey;!important;">
                <td>{{$customer->name}}</td>
                <td>{{$customer->phone}}</td>
                <td>{{$customer->email}}</td>
                <td>{{$customer->sales_count}}</td>
                <td width="150px" align="right">{{currencyAlignment(number_format((float)$customer->grand_total, 2))}}</td>
            </tr>
        @endforeach
    @endif
    </tbody>
</table>

</body>
</html>
