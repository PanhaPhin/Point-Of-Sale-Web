<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title> Sale report pdf</title>
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
    @foreach($sales  as $sale)
        <tr align="center">
            <td>{{$sale->reference_code}}</td>
            <td>{{$sale->customer->name}}</td>
            <td>{{$sale->warehouse->name}}</td>
            <td style="float: left">{{number_format($sale->grand_total,2)}}</td>
            <td>{{number_format((float)$sale->payments->sum('amount'), 2)}}</td>
            <td>{{number_format((float)$sale->due_amount, 2)}}</td>
            @if($sale->status == \App\Models\Sale::PAID)
                <td>paid</td>
            @elseif($sale->status == \App\Models\Sale::UNPAID)
                <td>unpaid</td>
            @elseif($sale->status == \App\Models\Sale::PARTIAL_PAID)
                <td>partial</td>
            @endif
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
