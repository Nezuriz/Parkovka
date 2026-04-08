/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JenisKendaraan" AS ENUM ('motor', 'mobil', 'lainnya');

-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('masuk', 'keluar');

-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('admin', 'petugas', 'owner');

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "tb_user" (
    "id_user" SERIAL NOT NULL,
    "nama_lengkap" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'petugas',
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "tb_area_parkir" (
    "id_area" SERIAL NOT NULL,
    "nama_area" VARCHAR(50) NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "terisi" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tb_area_parkir_pkey" PRIMARY KEY ("id_area")
);

-- CreateTable
CREATE TABLE "tb_tarif" (
    "id_tarif" SERIAL NOT NULL,
    "jenis_kendaraan" "JenisKendaraan" NOT NULL,
    "tarif_per_jam" DECIMAL(10,0) NOT NULL,

    CONSTRAINT "tb_tarif_pkey" PRIMARY KEY ("id_tarif")
);

-- CreateTable
CREATE TABLE "tb_kendaraan" (
    "id_kendaraan" SERIAL NOT NULL,
    "plat_nomor" VARCHAR(15) NOT NULL,
    "jenis_kendaraan" "JenisKendaraan" NOT NULL,
    "warna" VARCHAR(20) NOT NULL,
    "pemilik" VARCHAR(100) NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "tb_kendaraan_pkey" PRIMARY KEY ("id_kendaraan")
);

-- CreateTable
CREATE TABLE "tb_transaksi" (
    "id_parkir" SERIAL NOT NULL,
    "id_kendaraan" INTEGER NOT NULL,
    "waktu_masuk" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu_keluar" TIMESTAMP(0),
    "id_tarif" INTEGER NOT NULL,
    "durasi_jam" INTEGER,
    "biaya_total" DECIMAL(10,0),
    "status" "StatusTransaksi" NOT NULL DEFAULT 'masuk',
    "id_user" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,

    CONSTRAINT "tb_transaksi_pkey" PRIMARY KEY ("id_parkir")
);

-- CreateTable
CREATE TABLE "tb_log_aktivitas" (
    "id_log" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "aktivitas" VARCHAR(100) NOT NULL,
    "waktu_aktivitas" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_log_aktivitas_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_username_key" ON "tb_user"("username");

-- AddForeignKey
ALTER TABLE "tb_kendaraan" ADD CONSTRAINT "tb_kendaraan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tb_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_id_kendaraan_fkey" FOREIGN KEY ("id_kendaraan") REFERENCES "tb_kendaraan"("id_kendaraan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_id_tarif_fkey" FOREIGN KEY ("id_tarif") REFERENCES "tb_tarif"("id_tarif") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tb_user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "tb_area_parkir"("id_area") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_log_aktivitas" ADD CONSTRAINT "tb_log_aktivitas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tb_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
