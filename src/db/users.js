import { db } from './index.js';
import { users } from './schema.js';

export async function getOrCreateUser(uid, email) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
      },
    })
    .returning();

  return result[0];
}
