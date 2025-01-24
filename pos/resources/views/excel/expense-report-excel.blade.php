<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title> Excel report pdf</title>
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
        <th style="width: 200%">{{ __('messages.pdf.date') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.reference') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.amount') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.category') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.warehouse') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($expenses  as $expense)
        <tr align="center">
            <td>{{$expense->date->todatestring()}}</td>
            <td>{{$expense->reference_code}}</td>
            <td style="float: left">{{number_format($expense->amount,2)}}</td>
            <td>{{$expense->warehouse->name}}</td>
            <td>{{$expense->expenseCategory->name}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
