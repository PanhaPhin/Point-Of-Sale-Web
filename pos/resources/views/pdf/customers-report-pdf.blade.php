<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.pdf.customer_pdf') }}</title>
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
        <td align="center" style="vertical-align: bottom">
            <h2 style="color: dodgerblue;">client : {{$customer->name}}</h2>
        </td>
    </tr>
</table>
<table width="100%" style="margin-top: 40px;">
    <tr style="vertical-align: top;">
        <td style="width: 50%;">
            <table width="95%" cellpadding="0">
                <tr style="background-color: dodgerblue;">
                    <td style="color: #fff;padding: 10px;font-size: 18px;">{{ getLoginUserLanguage() == 'cn' ? 'Customer Info' : __('messages.pdf.customer_info')}}</td>
                </tr>
                <tr style="background-color: #f5f3f3;">
                    <td style="padding: 10px;">
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Name' : __('messages.pdf.name') }}: <span
                                    class="fw-light vi-light-text">{{ isset($customer->name) ? $customer->name : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Phone' : __('messages.pdf.phone') }}: <span
                                    class="fw-light vi-light-text">{{ isset($customer->phone) ? $customer->phone : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Address' : __('messages.pdf.address') }}: <span class="fw-light vi-light-text">
                                {{ isset($customer->address) ? $customer->address : '' }}
                                {{ isset($customer->city) ? $customer->city : '' }}
                                {{ isset($customer->country) ? $customer->country : '' }}
                            </span></p>
                        <p class="fw-bold vi-bold-text">{{ getLoginUserLanguage() == 'cn' ? 'Email' : __('messages.pdf.email') }}: <span
                                    class="fw-light vi-light-text">{{ isset($customer->email) ? $customer->email : ''}}</span>
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
<table width="60%" align="right" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <tbody style="background-color: #f5f3f3;">
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Total Sales' : __('messages.pdf.total_sales') }}:</td>
        <td>{{ currencyAlignment(number_format((float)$salesData['totalSale'] , 2)) }}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Total Amount' : __('messages.pdf.total_amount') }}:</td>
        <td>{{ currencyAlignment(number_format((float)$salesData['totalAmount'] , 2)) }}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Total Paid' : __('messages.pdf.total_paid') }}:</td>
        <td>{{ currencyAlignment(number_format((float)$salesData['totalPaid'] , 2)) }}</td>
    </tr>
    <tr>
        <td>{{ getLoginUserLanguage() == 'cn' ? 'Total Sale Due' : __('messages.pdf.total_sale_due') }}:</td>
        <td>{{  currencyAlignment(number_format((float)$salesData['totalSalesDue'] , 2)) }}</td>
    </tr>
    </tbody>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ getLoginUserLanguage() == 'cn' ? 'Date' : __('messages.pdf.date') }}</th>
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
                <td>{{$sale->date->format('Y-m-d')}}</td>
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
