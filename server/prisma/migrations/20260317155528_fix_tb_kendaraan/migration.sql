/*
  Warnings:

  - You are about to drop the column `pemilik` on the `tb_kendaraan` table. All the data in the column will be lost.
  - You are about to drop the column `warna` on the `tb_kendaraan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_kendaraan" DROP COLUMN "pemilik",
DROP COLUMN "warna";
