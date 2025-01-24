<?php

namespace Database\Seeders;

use App\Models\SmsTemplate;
use Illuminate\Database\Seeder;

class DefaultSmsTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userCreateSmsSale = [
            'template_name' => 'GREETING TO CUSTOMER ON SALES !',
            'content' => 'Hi {customer_name}, Your sales Id is {sales_id}, Sales Date {sales_date}, Total Amount {sales_amount}, You have paid {paid_amount}, and customer total due amount is {due_amount} Thank you visit again',
            'type' => SmsTemplate::SMS_TYPE_SALE,
        ];
        SmsTemplate::create($userCreateSmsSale);

        $userCreateSmsSaleReturn = [
            'template_name' => 'GREETING TO CUSTOMER ON SALES RETURN !',
            'content' => 'Hi {customer_name}, Your sales return Id is {sales_return_id}, Sales return Date {sales_return_date}, and Total Amount is {sales_return_amount} Thank you visit again',
            'type' => SmsTemplate::SMS_TYPE_SALE_RETURN,
        ];
        SmsTemplate::create($userCreateSmsSaleReturn);
    }
}
