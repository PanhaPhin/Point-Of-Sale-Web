<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.pdf.customer_sales_pdf') }}</title>
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
            <h2 style="color: dodgerblue;">{{ getLoginUserLanguage() == 'cn' ? 'Sale List' : __('messages.pdf.sale_list') }}</h2>
        </td>
    </tr>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Date' : __('messages.pdf.date') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Customer Name' : __('messages.pdf.customer_name') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Reference' : __('messages.pdf.reference') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Paid Amount' : __('messages.pdf.paid_amount') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Due Amount' : __('messages.pdf.due_amount') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Payment Status' : __('messages.pdf.payment_status') }}</th>
    </tr>
    </thead>
    <tbody style="background-color: #f5f3f3;">
    @if(isset($customer->sales))
        @foreach($customer->sales  as $sale)
            <tr align="center" style="border-bottom: 2px solid darkgrey;!important;">
                <td width="20%">{{$sale->date->format('Y-m-d')}}</td>
                <td>{{$customer->name}}</td>
                <td>{{$sale->reference_code}}</td>
                <td align="right">{{currencyAlignment(number_format((float)$sale->payments->sum('amount') , 2))}}</td>
                <td align="right">{{currencyAlignment(number_format((float)$sale->grand_total - $sale->payments->sum('amount') , 2))}}</td>
                <td>
                    @if($sale->payment_status == \App\Models\Sale::PAID)
                        Paid
                    @elseif($sale->payment_status == \App\Models\Sale::UNPAID)
                        Unpaid
                    @elseif($sale->payment_status == \App\Models\Sale::PARTIAL_PAID)
                        Partial
                    @endif
                </td>
            </tr>
        @endforeach
    @endif
    </tbody>
</table>

</body>
</html>
