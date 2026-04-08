import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        nama_lengkap: 'Administrator Utama',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        status_aktif: true,
      },
    });
    console.log('Admin default berhasil dibuat! (Username: admin, Pass: admin123)');
  } else {
    console.log('Admin sudah tersedia di database.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });