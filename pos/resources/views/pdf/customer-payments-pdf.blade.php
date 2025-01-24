<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.pdf.customer_payments_pdf') }}</title>
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
            <h2 style="color: dodgerblue;">{{ getLoginUserLanguage() == 'cn' ? 'Payment List' : __('messages.pdf.payment_list') }}</h2>
        </td>
    </tr>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Date' : __('messages.pdf.date') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Sale Reference' : __('messages.pdf.sale_reference') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Paid Amount' : __('messages.pdf.paid_amount') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Payment Type' : __('messages.pdf.payment_type') }}</th>
    </tr>
    </thead>
    <tbody style="background-color: #f5f3f3;">
    @foreach($payments  as $payment)
        <tr align="center" style="border-bottom: 2px solid darkgrey;!important;">
            <td width="20%">{{$payment->payment_date}}</td>
            <td>{{$payment->sale->reference_code}}</td>
            <td align="right">{{currencyAlignment(number_format((float)$payment->amount, 2))}}</td>
            <td>
                @if($payment->payment_type == \App\Models\SalesPayment::CASH)
                    Cash
                @elseif($payment->payment_type == \App\Models\SalesPayment::CHEQUE)
                    Cheque
                @elseif($payment->payment_type == \App\Models\SalesPayment::BANK_TRANSFER)
                    Bank Transfer
                @elseif($payment->payment_type == \App\Models\SalesPayment::OTHER)
                    Other
                @else
                    N/A
                @endif
            </td>
        </tr>
    @endforeach
    </tbody>
</table>

</body>
</html>
