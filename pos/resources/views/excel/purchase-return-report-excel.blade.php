<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title> Purchase return report pdf</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css"/>
</head>
<body>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="width: 200%">{{ __('messages.pdf.reference') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.client') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.warehouse') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.total') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.paid') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.due') }}</th>
        <th style="width: 300%">{{ __('messages.pdf.payment_status') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($purchaseReturns  as $purchaseReturn)
        <tr align="center">
            <td>{{$purchaseReturn->reference_code}}</td>
            <td>{{$purchaseReturn->supplier->name}}</td>
            <td>{{$purchaseReturn->warehouse->name}}</td>
            <td style="float: left">{{number_format($purchaseReturn->grand_total,2)}}</td>
            <td>{{number_format((float)$purchaseReturn->paid_amount, 2)}}</td>
            <td>{{number_format((float)$purchaseReturn->due_amount, 2)}}</td>
            @if($purchaseReturn->payment_status == \App\Models\PurchaseReturn::PAID)
                <td>paid</td>
            @elseif($purchaseReturn->payment_status == \App\Models\PurchaseReturn::UNPAID)
                <td>unpaid</td>
            @endif
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
