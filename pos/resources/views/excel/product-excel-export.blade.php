<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>Products Excel Export</title>
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
        <th style="width: 200%">{{ __('messages.pdf.product') }}</th>   
        <th style="width: 200%">{{ __('messages.pdf.code') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.brand') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.price') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.product_unit') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.in_stock') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.created_on') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($products  as $product)
        <tr align="center">
            <td>{{$product->name}}</td>
            <td>{{$product->code}}</td>
            <td>{{$product->brand->name}}</td>
            <td>{{$product->product_price}}</td>
            <td>
                <?php
                $productUnitName = App\Models\BaseUnit::where('id',$product->product_unit)->value('name');
                ?>
                {{$productUnitName}}
            </td>
            <td>
                <?php
                $totalQuantity = App\Models\Managestock::where('product_id', $product->id)->sum('quantity');
                ?>
                {{$totalQuantity}}
            </td>
            <td>{{ \Carbon\Carbon::parse($product->created_at)->isoFormat('Do MMM, YYYY')}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
