/*
  Warnings:

  - You are about to drop the column `id_user` on the `tb_kendaraan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_kendaraan" DROP CONSTRAINT "tb_kendaraan_id_user_fkey";

-- AlterTable
ALTER TABLE "tb_kendaraan" DROP COLUMN "id_user";
