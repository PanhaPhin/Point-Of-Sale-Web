@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ getSettingValue('logo') }}" class="logo" alt="{{ getSettingValue('company_name') }}"
                 style="position:relative !important;width: 270px !important;right: -7px; !important;">
        @endcomponent
    @endslot


    {{-- Body --}}
    <div>
        {!! $data !!}
    </div>


    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            <h6>© {{ date('Y') }} {{ getSettingValue('company_name') }}.</h6>
        @endcomponent
    @endslot
@endcomponent
