/*
  Warnings:

  - A unique constraint covering the columns `[plat_nomor]` on the table `tb_kendaraan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tb_kendaraan_plat_nomor_key" ON "tb_kendaraan"("plat_nomor");
