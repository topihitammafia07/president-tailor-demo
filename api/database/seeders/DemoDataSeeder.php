<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    /**
     * Run demo database seeds.
     */
    public function run(): void
    {
        // Don't re-seed if orders already exist
        if (Order::count() > 0) {
            return;
        }

        $jas = ServiceType::where('slug', 'jas')->first();
        $batik = ServiceType::where('slug', 'hem-batik')->first();
        $celana = ServiceType::where('slug', 'celana-panjang')->first();

        $staffUser = User::where('role', User::ROLE_STAFF)->first()
            ?: User::first();

        DB::transaction(function () use ($jas, $batik, $celana, $staffUser) {
            // Customer 1
            $c1 = Customer::create([
                'name' => 'Bpk. H. Bambang Sudiro',
                'phone' => '081234567890',
                'address' => 'Jl. Slamet Riyadi No. 42, Sukoharjo',
                'created_at' => '2026-09-01 09:30:00',
            ]);

            // Order 1: Selesai & Lunas
            $o1 = Order::create([
                'order_number' => 'ORD-20260901-0001',
                'customer_id' => $c1->id,
                'customer_name_snapshot' => $c1->name,
                'customer_address_snapshot' => $c1->address,
                'status' => Order::STATUS_SELESAI,
                'total_price' => 2800000,
                'created_at' => '2026-09-01 10:00:00',
            ]);
            if ($jas) {
                OrderItem::create([
                    'order_id' => $o1->id,
                    'service_type_id' => $jas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Jas Formal Wol Hitam. Dada: 104cm, Bahu: 47cm, Pjg Jas: 76cm, Tangan: 62cm. Model 2 Kancing.',
                    'created_at' => '2026-09-01 10:00:00',
                ]);
            }
            if ($celana) {
                OrderItem::create([
                    'order_id' => $o1->id,
                    'service_type_id' => $celana->id,
                    'quantity' => 2,
                    'measurements_note' => 'Semi-Wool Charcoal. Pinggang: 86cm, Paha: 62cm, Pjg Celana: 100cm, Bawah: 19cm.',
                    'created_at' => '2026-09-01 10:00:00',
                ]);
            }
            Payment::create([
                'order_id' => $o1->id,
                'amount' => 1500000,
                'payment_date' => '2026-09-01',
                'payment_method' => Payment::METHOD_TRANSFER,
                'notes' => 'DP pesanan jas & 2 celana via BCA',
                'created_by' => $staffUser?->id,
                'created_at' => '2026-09-01 10:05:00',
            ]);
            Payment::create([
                'order_id' => $o1->id,
                'amount' => 1300000,
                'payment_date' => '2026-09-15',
                'payment_method' => Payment::METHOD_TUNAI,
                'notes' => 'Pelunasan saat fitting akhir & serah terima jas',
                'created_by' => $staffUser?->id,
                'created_at' => '2026-09-15 15:35:00',
            ]);

            // Customer 2
            $c2 = Customer::create([
                'name' => 'Dr. Hendra Wibowo, Sp.A',
                'phone' => '081398765432',
                'address' => 'Perum Solo Baru Sektor 3, Sukoharjo',
                'created_at' => '2026-09-18 10:15:00',
            ]);

            // Order 2: Selesai & Lunas
            $o2 = Order::create([
                'order_number' => 'ORD-20260918-0002',
                'customer_id' => $c2->id,
                'customer_name_snapshot' => $c2->name,
                'customer_address_snapshot' => $c2->address,
                'status' => Order::STATUS_SELESAI,
                'total_price' => 1350000,
                'created_at' => '2026-09-18 14:30:00',
            ]);
            if ($batik) {
                OrderItem::create([
                    'order_id' => $o2->id,
                    'service_type_id' => $batik->id,
                    'quantity' => 3,
                    'measurements_note' => 'Batik Tulis Sutra Parang. Kerah kaku, furing katun adem. Dada: 106cm, Pjg: 74cm.',
                    'created_at' => '2026-09-18 14:30:00',
                ]);
            }
            Payment::create([
                'order_id' => $o2->id,
                'amount' => 1350000,
                'payment_date' => '2026-09-18',
                'payment_method' => Payment::METHOD_QRIS,
                'notes' => 'Pembayaran lunas di muka via QRIS',
                'created_by' => $staffUser?->id,
                'created_at' => '2026-09-18 14:35:00',
            ]);

            // Customer 3
            $c3 = Customer::create([
                'name' => 'Bpk. Suryanto Kusuma, S.E.',
                'phone' => '081567891234',
                'address' => 'Jl. Raya Palur Km 5, Sukoharjo',
                'created_at' => '2026-10-02 08:45:00',
            ]);

            // Order 3: Diproses & Piutang Rp 1.200.000
            $o3 = Order::create([
                'order_number' => 'ORD-20261002-0003',
                'customer_id' => $c3->id,
                'customer_name_snapshot' => $c3->name,
                'customer_address_snapshot' => $c3->address,
                'status' => Order::STATUS_DIPROSES,
                'total_price' => 3200000,
                'created_at' => '2026-10-02 09:15:00',
            ]);
            if ($jas) {
                OrderItem::create([
                    'order_id' => $o3->id,
                    'service_type_id' => $jas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Jas Pengantin Modern Navy. Dada: 108cm, Bahu: 48cm, Pjg Jas: 77cm.',
                    'created_at' => '2026-10-02 09:15:00',
                ]);
            }
            if ($batik) {
                OrderItem::create([
                    'order_id' => $o3->id,
                    'service_type_id' => $batik->id,
                    'quantity' => 1,
                    'measurements_note' => 'Hem Batik Sutra Pengantin senada jas.',
                    'created_at' => '2026-10-02 09:15:00',
                ]);
            }
            if ($celana) {
                OrderItem::create([
                    'order_id' => $o3->id,
                    'service_type_id' => $celana->id,
                    'quantity' => 1,
                    'measurements_note' => 'Celana Wol Navy senada jas. Pinggang: 90cm, Pjg: 102cm.',
                    'created_at' => '2026-10-02 09:15:00',
                ]);
            }
            Payment::create([
                'order_id' => $o3->id,
                'amount' => 2000000,
                'payment_date' => '2026-10-02',
                'payment_method' => Payment::METHOD_TRANSFER,
                'notes' => 'Uang muka tahap 1 via Mandiri. Sisa Rp 1.200.000 saat fitting.',
                'created_by' => $staffUser?->id,
                'created_at' => '2026-10-02 09:20:00',
            ]);

            // Customer 4
            $c4 = Customer::create([
                'name' => 'Bpk. Joko Prasetyo',
                'phone' => '081789012345',
                'address' => 'Kartasura, Sukoharjo',
                'created_at' => '2026-10-08 10:00:00',
            ]);

            // Order 4: Diproses & Piutang Rp 450.000
            $o4 = Order::create([
                'order_number' => 'ORD-20261008-0004',
                'customer_id' => $c4->id,
                'customer_name_snapshot' => $c4->name,
                'customer_address_snapshot' => $c4->address,
                'status' => Order::STATUS_DIPROSES,
                'total_price' => 900000,
                'created_at' => '2026-10-08 11:00:00',
            ]);
            if ($celana) {
                OrderItem::create([
                    'order_id' => $o4->id,
                    'service_type_id' => $celana->id,
                    'quantity' => 3,
                    'measurements_note' => 'Bahan Katun Drill Khaki & Hitam. Pinggang: 82cm, Paha: 58cm, Pjg: 98cm.',
                    'created_at' => '2026-10-08 11:00:00',
                ]);
            }
            Payment::create([
                'order_id' => $o4->id,
                'amount' => 450000,
                'payment_date' => '2026-10-08',
                'payment_method' => Payment::METHOD_TUNAI,
                'notes' => 'DP 50% tunai kasir. Sisa Rp 450.000 saat ambil.',
                'created_by' => $staffUser?->id,
                'created_at' => '2026-10-08 11:05:00',
            ]);

            // Customer 5
            $c5 = Customer::create([
                'name' => 'Bpk. Ir. Agung Nugroho',
                'phone' => '081223344556',
                'address' => 'Gentan, Baki, Sukoharjo',
                'created_at' => '2026-10-12 14:20:00',
            ]);

            // Order 5: Baru & Belum Bayar Rp 1.750.000
            $o5 = Order::create([
                'order_number' => 'ORD-20261012-0005',
                'customer_id' => $c5->id,
                'customer_name_snapshot' => $c5->name,
                'customer_address_snapshot' => $c5->address,
                'status' => Order::STATUS_BARU,
                'total_price' => 1750000,
                'created_at' => '2026-10-12 16:20:00',
            ]);
            if ($jas) {
                OrderItem::create([
                    'order_id' => $o5->id,
                    'service_type_id' => $jas->id,
                    'quantity' => 1,
                    'measurements_note' => 'Jas Safari Lengan Pendek Saku 4. Dada: 102cm, Pjg: 73cm.',
                    'created_at' => '2026-10-12 16:20:00',
                ]);
            }
            if ($celana) {
                OrderItem::create([
                    'order_id' => $o5->id,
                    'service_type_id' => $celana->id,
                    'quantity' => 1,
                    'measurements_note' => 'Celana Safari Senada. Pinggang: 84cm, Pjg: 99cm.',
                    'created_at' => '2026-10-12 16:20:00',
                ]);
            }
        });
    }

    /**
     * Clean demo data.
     */
    public static function reset(): void
    {
        DB::transaction(function () {
            Payment::query()->delete();
            OrderItem::query()->delete();
            Order::query()->delete();
            Customer::query()->delete();
        });
    }
}
