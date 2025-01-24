<?php

namespace App\Http\Controllers\API\M1;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateCustomerRequest;
use App\Repositories\CustomerRepository;
use Illuminate\Http\JsonResponse;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class CustomerAPIController
 */
class CustomerAPIController extends AppBaseController
{
    private CustomerRepository $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function index(): JsonResponse
    {
        $customers = $this->customerRepository->get();
        $data = [];
        foreach ($customers as $customer) {
            $data[] = $customer->prepareCustomers();
        }

        return $this->sendResponse($data, 'Customers Retrieved Successfully');
    }

    /**
     * @throws ValidatorException
     */
    public function store(CreateCustomerRequest $request): JsonResponse
    {
        $input = $request->all();
        if (! empty($input['dob'])) {
            $input['dob'] = $input['dob'] ?? date('Y/m/d');
        }
        $this->customerRepository->create($input);

        return $this->sendSuccess('Customer created successfully');
    }
}
