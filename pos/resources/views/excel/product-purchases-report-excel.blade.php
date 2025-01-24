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
        <th style="width: 200%">{{ __('messages.pdf.quantity') }}</th>
        <th style="width: 200%">{{ __('messages.pdf.total') }}</th>
    </tr>
    </thead>
    <tbody>
    @foreach($purchases  as $purchase)
        <tr>
            <td>{{$purchase->reference_code}}</td>
            <td>{{$purchase->supplier->name}}</td>
            <td>{{$purchase->warehouse->name}}</td>
            @foreach($purchase->purchaseItems as $items)
                @if($items->product_id == $productId)
                    <td>{{$items->quantity}}</td>
                    <td>{{number_format($items->sub_total,2)}}</td>
                @endif
                @break
            @endforeach
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
