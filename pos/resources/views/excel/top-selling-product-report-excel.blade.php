<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title> Purchase report pdf</title>
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
        <th style="width: 250%">{{ __('messages.pdf.product_code') }}</th>
        <th style="width: 300%">{{ __('messages.pdf.product_name') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.price') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.quantity') }}</th>
        <th style="width: 250%">{{ __('messages.pdf.total_amount') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($topSellingProducts  as $product)
        <tr align="center">
            <td>{{$product['code']}}</td>
            <td>{{$product['name']}}</td>
            <td>{{number_format((float)$product['price'], 2)}}</td>
            <td>{{$product['total_quantity']}}</td>
            <td>{{number_format((float)$product['grand_total'], 2)}}</td>
            <td></td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
