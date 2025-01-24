<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CustomerImport implements ToCollection, WithChunkReading, WithStartRow, WithValidation
{
    public function collection(Collection $rows): JsonResponse
    {
        $collection = $rows->toArray();

        foreach ($collection as $key => $row) {
            try {
                DB::beginTransaction();
                $customerEmail = Customer::whereEmail($row[1])->exists();
                if ($customerEmail) {
                    throw new UnprocessableEntityHttpException('Email '.$row[1].' is already exist.');
                }

                if (preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", trim($row[1])) == 0) {
                    throw new UnprocessableEntityHttpException('Email '.$row[1].' is not the valid email address.');
                }

                $customerData = [
                    'name' => $row[0],
                    'email' => $row[1],
                    'phone' => $row[2],
                    'country' => $row[3],
                    'city' => $row[4],
                    'address' => $row[5],
                ];

                Customer::create($customerData);

                DB::commit();
            } catch (\Exception $e) {
                throw new UnprocessableEntityHttpException($e->getMessage());
            }

            return response()->json([
                'data' => [
                    'message' => 'Customer imported successfully',
                ],
            ]);
        }
    }

    public function chunkSize(): int
    {
        return 1;
    }

    public function startRow(): int
    {
        return 2;
    }

    public function rules(): array
    {
        return [
            '0' => 'required',
            '1' => 'required',
            '2' => 'required|numeric',
            '3' => 'required',
            '4' => 'required',
            '5' => 'required',
        ];
    }

    public function customValidationMessages()
    {
        return [
            '0.required' => 'Name field is required',
            '1.required' => 'Email field is required',
            '2.required' => 'Phone Number field is required',
            '3.required' => 'Country field is required',
            '4.required' => 'City field is required',
            '5.required' => 'Address field is required',
        ];
    }
}
