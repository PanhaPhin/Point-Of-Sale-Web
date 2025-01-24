<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.Sale_return_pdf') }}</title>
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

         @if(getLoginUserLanguage() =='vi')
            .vi-bold-text {
                font-size: 14px;
                font-weight: bolder;
                color: #333;
            }

            .vi-light-text {
                font-size: 16px;
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
        <td>
            <img src="{{$companyLogo}}" alt="Company Logo" width="80px">
        </td>
        <td align="center" style="vertical-align: bottom">
            <h2 style="color: dodgerblue;">{{ $saleReturn->reference_code }}</h2>
        </td>
        <td width="30%" style="line-height: 5px;">
            <h4 class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Date' : __('messages.pdf.date') }}: <span
                        class="fw-light vi-light-text">{{ \Carbon\Carbon::parse($saleReturn->created_at)->format('Y-m-d') }}</span>
            </h4>
            <h4 class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Number' : __('messages.pdf.number') }}: <span
                        class="fw-light vi-light-text">{{ $saleReturn->reference_code }}</span></h4>
            <h4 class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Payment Status' : __('messages.pdf.payment_status') }}: <span
                        class="fw-light vi-light-text">{{ $saleReturn->payment_status == \App\Models\Sale::PAID ? 'Paid' : 'Unpaid' }}</span>
            </h4>
        </td>
    </tr>
</table>
<table width="100%" style="margin-top: 40px;">
    <tr align="top" style="vertical-align: top;">
        <td style="width: 50%;">
            <table width="95%" cellpadding="0">
                <tr style="background-color: dodgerblue;">
                    <td style="color: #fff;padding: 10px;font-size: 18px;">{{ getLoginUserLanguage() == 'cn' ? 'Customer Info' : __('messages.pdf.customer_info') }}</td>
                </tr>
                <tr style="background-color: #f5f3f3;">
                    <td style="padding: 10px;">
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Name' : __('messages.pdf.name') }}: <span
                                    class="fw-light vi-light-text">{{ isset($saleReturn->customer->name) ? $saleReturn->customer->name : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Phone' : __('messages.pdf.phone') }}: <span
                                    class="fw-light vi-light-text">{{ isset($saleReturn->customer->phone) ? $saleReturn->customer->phone : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Address' : __('messages.pdf.address') }}: <span class="fw-light vi-light-text">
                                {{ isset($saleReturn->customer->address) ? $saleReturn->customer->address : '' }}
                                {{ isset($saleReturn->customer->city) ? $saleReturn->customer->city : '' }}
                                {{ isset($saleReturn->customer->country) ? $saleReturn->customer->country : '' }}
                            </span></p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Email' : __('messages.pdf.email') }}: <span
                                    class="fw-light vi-light-text">{{ isset($saleReturn->customer->email) ? $saleReturn->customer->email : ''}}</span>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
        <td style="width: 50%;">
            <table width="95%" align="right">
                <tr style="background-color: dodgerblue;">
                    <td style="color: #fff;padding: 10px;font-size: 18px;">{{ getLoginUserLanguage() == 'cn' ? 'Company Info' : __('messages.pdf.company_info') }}</td>
                </tr>
                <tr style="background-color: #f5f3f3;">
                    <td style="padding: 10px;">
                        <h3 style="color: #333;">{{ getSettingValue('company_name') }}</h3>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Address' : __('messages.pdf.address') }}: <span
                                    class="fw-light vi-light-text">{{ getSettingValue('address') }}</span></p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Phone' : __('messages.pdf.phone') }}: <span
                                    class="fw-light vi-light-text">{{ getSettingValue('phone') }}</span></p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Email' : __('messages.pdf.email') }}: <span
                                    class="fw-light vi-light-text">{{ getSettingValue('email') }}</span></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Product' : __('messages.pdf.product') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'UNIT PRICE' : __('messages.pdf.unit_price') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'QUANTITY' : __('messages.pdf.quantity') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'DISCOUNT' : __('messages.heading_discount') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'TAX' : __('messages.pdf.tax') }}</th>
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'TOTAL' : __('messages.heading_total') }}</th>
    </tr>
    </thead>
    <tbody style="background-color: #f5f3f3;">
    @foreach($saleReturn->saleReturnItems  as $saleReturnItem)
        <tr align="center">
            <td>{{$saleReturnItem->product->name}}</td>
            <td>{{currencyAlignment(number_format((float)$saleReturnItem->net_unit_price, 2))}}</td>
            <td>{{$saleReturnItem->quantity}}</td>
            <td>{{currencyAlignment(number_format((float)$saleReturnItem->discount_amount, 2))}}</td>
            <td>{{currencyAlignment(number_format((float)$saleReturnItem->tax_amount, 2))}}</td>
            <td>{{currencyAlignment(number_format((float)$saleReturnItem->sub_total, 2))}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
<table width="60%" align="right" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <tbody style="background-color: #f5f3f3;">
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Order Tax' : __('messages.pdf.order_tax') }}</td>
        <td>{{currencyAlignment(number_format((float)$saleReturn->tax_amount, 2))}}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Discount' : __('messages.pdf.discount') }}</td>
        <td>{{currencyAlignment(number_format((float)$saleReturn->discount, 2))}}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Shipping' : __('messages.pdf.shipping') }}</td>
        <td>{{currencyAlignment(number_format((float)$saleReturn->shipping, 2))}}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Total' : __('messages.pdf.total') }}</td>
        <td>{{currencyAlignment(number_format((float)$saleReturn->grand_total, 2))}}</td>
    </tr>

    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Paid Amount' : __('messages.pdf.paid_amount') }}</td>
        <td>{{currencyAlignment(number_format((float)$saleReturn->received_amount, 2))}}</td>
    </tr>
    </tbody>
</table>
</body>
</html>
