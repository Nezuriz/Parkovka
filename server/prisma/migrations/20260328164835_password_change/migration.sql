/*
  Warnings:

  - You are about to drop the column `id_kendaraan` on the `tb_transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `id_tarif` on the `tb_transaksi` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `tb_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(10)`.
  - You are about to drop the `tb_kendaraan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_tarif` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_jenis` to the `tb_transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plat_nomor` to the `tb_transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_transaksi" DROP CONSTRAINT "tb_transaksi_id_kendaraan_fkey";

-- DropForeignKey
ALTER TABLE "tb_transaksi" DROP CONSTRAINT "tb_transaksi_id_tarif_fkey";

-- AlterTable
ALTER TABLE "tb_transaksi" DROP COLUMN "id_kendaraan",
DROP COLUMN "id_tarif",
ADD COLUMN     "id_jenis" INTEGER NOT NULL,
ADD COLUMN     "plat_nomor" VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE "tb_user" ALTER COLUMN "password" SET DATA TYPE VARCHAR(10);

-- DropTable
DROP TABLE "tb_kendaraan";

-- DropTable
DROP TABLE "tb_tarif";

-- DropEnum
DROP TYPE "JenisKendaraan";

-- CreateTable
CREATE TABLE "tb_jenis_kendaraan" (
    "id_jenis" SERIAL NOT NULL,
    "nama_jenis" VARCHAR(50) NOT NULL,
    "tarif_per_jam" DECIMAL(10,0) NOT NULL,

    CONSTRAINT "tb_jenis_kendaraan_pkey" PRIMARY KEY ("id_jenis")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_jenis_kendaraan_nama_jenis_key" ON "tb_jenis_kendaraan"("nama_jenis");

-- AddForeignKey
ALTER TABLE "tb_transaksi" ADD CONSTRAINT "tb_transaksi_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "tb_jenis_kendaraan"("id_jenis") ON DELETE RESTRICT ON UPDATE CASCADE;
