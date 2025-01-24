create table `sales_payments`
(
    `id`           bigint unsigned not null auto_increment primary key,
    `sale_id`      bigint unsigned not null,
    `payment_date` date not null,
    `payment_type` int null,
    `amount`       double null,
    `created_at`   timestamp null,
    `updated_at`   timestamp null
) default character set utf8mb4 collate 'utf8mb4_unicode_ci';


alter table `sales_payments`
    add constraint `sales_payments_sale_id_foreign` foreign key (`sale_id`) references `sales` (`id`) on delete cascade on update cascade;

alter table `sales_payments`
    add `reference` varchar(255) null after `sale_id`;

alter table `sales_payments`
    add `received_amount` double null after `amount`;

create table `adjustments`
(
    `id`             bigint unsigned not null auto_increment primary key,
    `date`           date not null,
    `reference_code` varchar(255) null,
    `warehouse_id`   bigint unsigned not null,
    `total_products` int null,
    `created_at`     timestamp null,
    `updated_at`     timestamp null
) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `adjustments`
    add constraint `adjustments_warehouse_id_foreign` foreign key (`warehouse_id`) references `warehouses` (`id`) on delete cascade on update cascade;

create table `adjustment_items`
(
    `id`            bigint unsigned not null auto_increment primary key,
    `adjustment_id` bigint unsigned not null,
    `product_id`    bigint unsigned not null,
    `quantity`      double null,
    `method_type`   int not null,
    `created_at`    timestamp null,
    `updated_at`    timestamp null
) default character set utf8mb4 collate 'utf8mb4_unicode_ci';

alter table `adjustment_items`
    add constraint `adjustment_items_adjustment_id_foreign` foreign key (`adjustment_id`) references `adjustments` (`id`) on delete cascade on update cascade;

alter table `adjustment_items`
    add constraint `adjustment_items_product_id_foreign` foreign key (`product_id`) references `products` (`id`) on delete cascade on update cascade;
