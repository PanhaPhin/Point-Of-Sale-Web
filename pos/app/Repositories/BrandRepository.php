<?php

namespace App\Repositories;

use App\Models\Brand;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class BrandRepository
 */
class BrandRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'description',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
        'description',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return Brand::class;
    }

    public function storeBrand($input)
    {
        try {
            DB::beginTransaction();
            $brand = $this->create($input);
            if (isset($input['image']) && $input['image']) {
                $media = $brand->addMedia($input['image'])->toMediaCollection(Brand::PATH,
                    config('filesystems.default'));
            }
            DB::commit();

            return $brand;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateBrand($input, $id)
    {
        try {
            DB::beginTransaction();
            $brand = $this->update($input, $id);
            if (isset($input['image']) && $input['image']) {
                $brand->clearMediaCollection(Brand::PATH);
                $brand['image_url'] = $brand->addMedia($input['image'])->toMediaCollection(Brand::PATH,
                    config('filesystems.default'));
            }
            DB::commit();

            return $brand;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
