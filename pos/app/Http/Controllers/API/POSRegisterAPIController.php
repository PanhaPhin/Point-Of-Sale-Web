<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreatePOSRegisterRequest;
use App\Http\Resources\POSRegisterCollection;
use App\Http\Resources\POSRegisterResource;
use App\Models\POSRegister;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\SalesPayment;
use App\Repositories\POSRegisterRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class POSRegisterAPIController extends AppBaseController
{
    public $posReg;

    public function __construct(POSRegisterRepository $posReg)
    {
        $this->posReg = $posReg;
    }

    public function entry(CreatePOSRegisterRequest $request)
    {
        $input = $request->all();
        $input['user_id'] = Auth::id();

        POSRegister::create($input);

        return $this->sendSuccess('Register entry added successfully.');
    }

    public function closeRegister(Request $request)
    {
        $input = $request->all();
        $register = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->first();

        if (! $register) {
            return $this->sendError('Register entry not found.');
        }

        $data = $this->getRegisterData($register->created_at->toDateString(), Carbon::now()->toDateString());

        $register->closed_at = Carbon::now();
        $register->cash_in_hand_while_closing = $input['cash_in_hand_while_closing'];
        $register->bank_transfer = $data['today_sales_bank_transfer_payment'];
        $register->cheque = $data['today_sales_cheque_payment'];
        $register->other = $data['today_sales_other_payment'];
        $register->total_sale = $data['today_sales_amount'];
        $register->total_return = $data['today_sales_return_amount'];
        $register->total_amount = $data['today_sales_payment_amount'];
        $register->notes = $input['notes'];
        $register->save();

        return $this->sendSuccess('Register entry updated successfully.');
    }

    public function getRegisterDetails(Request $request)
    {
        $register = POSRegister::where('user_id', Auth::id())
            ->whereNull('closed_at')
            ->first();

        $startDate = Carbon::now()->startOfDay()->toDateTimeString();
        $endDate = Carbon::now()->endOfDay()->toDateTimeString();
        if (! empty($register)) {
            $startDate = $register->created_at->toDateTimeString();
        }

        $data = $this->getRegisterData($startDate, $endDate);
        $data['cash_in_hand'] = $register->cash_in_hand;
        $data['total_cash_amount'] = $data['cash_in_hand'] + $data['todays_specific_sales_cash_payment']
            - $data['refunded_cash'];

        return $this->sendResponse($data, 'Details retrieved successfully');
    }

    public function registerReport(Request $request)
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';
        $input = $request->all();

        $register = $this->posReg;

        if (! empty($input['user_id'])) {
            $register->where('user_id', $input['user_id']);
        }

        if (! empty($input['start_date'])) {
            $register->whereDate('created_at', '>=', $input['start_date']);
        }

        if (! empty($input['end_date'])) {
            $register->whereDate('closed_at', '<=', $input['end_date']);
        }

        $register->orderByDesc('created_at')->whereNotNull('closed_at');

        $register = $register->paginate($perPage);

        POSRegisterResource::usingWithCollection();

        return new POSRegisterCollection($register);
    }

    public function getRegisterData($startDate, $endDate)
    {
        $totalGrandTotalAmount = Sale::where('user_id', Auth::id())
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('grand_total');

        $saleIds = Sale::where('user_id', Auth::id())
            ->whereBetween('created_at', [$startDate, $endDate])
            ->pluck('id')
            ->toArray();

        $data['today_sales_cash_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CASH)
            ->sum('amount');

        $data['todays_specific_sales_cash_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CASH)
            ->sum('amount');

        $data['today_sales_cheque_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::CHEQUE)
            ->sum('amount');

        $data['today_sales_bank_transfer_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::BANK_TRANSFER)
            ->sum('amount');

        $data['today_sales_other_payment'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_type', SalesPayment::OTHER)
            ->sum('amount');

        $data['today_sales_amount'] = $totalGrandTotalAmount;

        $data['today_sales_return_amount'] = SaleReturn::whereIn('sale_id', $saleIds)
            ->sum('grand_total');

        $data['today_sales_payment_amount'] = SalesPayment::whereIn('sale_id', $saleIds)
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->sum('amount');

        $data['today_sales_payment_amount'] = $data['today_sales_amount'] - $data['today_sales_return_amount'];
        $data['refunded_cash'] = SaleReturn::whereIn('sale_id', $saleIds)
            ->whereHas('sale', function (Builder $query) {
                $query->where('payment_type', Sale::CASH);
            })
            ->sum('grand_total');

        return $data;
    }
}
