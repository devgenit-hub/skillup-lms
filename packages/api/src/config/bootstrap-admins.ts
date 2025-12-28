import { createClient } from '@supabase/supabase-js';
import { prisma } from '@repo/db';
import { UserRole } from '@repo/db';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export async function bootstrapAdmins(): Promise<void> {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  const adminPasswords = process.env.ADMIN_PASSWORDS?.split(',').map((p) => p.trim()) || [];

  if (adminEmails.length === 0) return;

  for (let i = 0; i < adminEmails.length; i++) {
    const email = adminEmails[i];
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      const password = adminPasswords[i] || generatePassword();

      if (existingUser) {
        if (existingUser.role !== UserRole.ADMIN) {
          await prisma.user.update({
            where: { email },
            data: { role: UserRole.ADMIN },
          });
          console.log(`✅ Admin ${email} role updated`);
        }

        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const authUserExists = authUsers.users.find((u) => u.email === email);

        if (!authUserExists) {
          const { data: authUser, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });

          if (error) {
            console.error(`❌ Failed to create Supabase Auth user for ${email}:`, error.message);
          } else {
            await prisma.user.update({
              where: { email },
              data: { supabaseId: authUser.user.id },
            });
            console.log(`✅ Admin ${email} Supabase auth created and synced`);
          }
        } else {
          // Auth user exists - sync supabaseId if different and update password
          if (existingUser.supabaseId !== authUserExists.id) {
            await prisma.user.update({
              where: { email },
              data: { supabaseId: authUserExists.id },
            });
            console.log(`✅ Admin ${email} supabaseId synced to ${authUserExists.id}`);
          }
          await supabase.auth.admin.updateUserById(authUserExists.id, { password });
        }

        continue;
      }

      const { data: authUser, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (error || !authUser.user) {
        console.error(`❌ Failed to create admin ${email}:`, error?.message);
        continue;
      }

      await prisma.user.create({
        data: {
          supabaseId: authUser.user.id,
          email: authUser.user.email!,
          emailVerified: true,
          role: UserRole.ADMIN,
        },
      });

      console.log(`✅ Admin ${email} created | Password: ${password}`);
      if (!adminPasswords[i]) {
        console.log('⚠️  Save this password securely');
      }
    } catch (err) {
      console.error(`❌ Error bootstrapping admin ${email}:`, err);
    }
  }
}
