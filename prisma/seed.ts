// prisma/seed.ts
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// ─── Données de seed ─────────────────────────────────────

const adminUser: Prisma.UserCreateInput = {
  name: "Administrateur",
  email: "admin@ointjoyalaweyministries.com",
  role: "ADMIN",
};

const events: Prisma.EventCreateInput[] = [
  {
    title: "Conférence Annuelle 2025",
    description: "Grand rassemblement annuel du ministère Ointjoyalaw.",
    startDate: new Date("2025-08-15T10:00:00Z"),
    location: "Abidjan, Palais de la Culture",
    capacity: 500,
    imageUrl: null,
    ticketTypes: {
      create: [
        { name: "Gratuit", price: 0,      quantity: 300 },
        { name: "Standard", price: 2000,  quantity: 150 },
        { name: "VIP",      price: 10000, quantity: 50  },
      ],
    },
  },
  {
    title: "Culte en ligne — Spécial Jeunesse",
    description: "Service en direct sur YouTube, ouvert à tous.",
    startDate: new Date("2025-07-05T18:00:00Z"),
    location: null, // en ligne
    capacity: null, // illimité
    ticketTypes: {
      create: [
        { name: "Accès libre", price: 0, quantity: 9999 },
      ],
    },
  },
];

const teachings: Prisma.TeachingCreateInput[] = [
  {
    title: "La puissance de la foi",
    youtubeUrl: "https://www.youtube.com/watch?v=exemple1",
    pdfUrl: null,
  },
  {
    title: "Marcher dans la grâce",
    youtubeUrl: "https://www.youtube.com/watch?v=exemple2",
    pdfUrl: "https://cdn.exemple.com/enseignements/grace.pdf",
  },
];

const newsletters: Prisma.NewsletterCreateInput[] = [
  { email: "fidele1@exemple.com" },
  { email: "fidele2@exemple.com" },
];

// ─── Seed principal ───────────────────────────────────────

export async function main() {
  console.log("🌱 Démarrage du seed...");

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: adminUser,
  });
  console.log(`✅ Admin créé : ${admin.email}`);

  // Événements
  for (const event of events) {
    const created = await prisma.event.create({ data: event });
    console.log(`✅ Événement créé : ${created.title}`);
  }

  // Enseignements
  for (const teaching of teachings) {
    const created = await prisma.teaching.create({ data: teaching });
    console.log(`✅ Enseignement créé : ${created.title}`);
  }

  // Newsletter
  for (const entry of newsletters) {
    await prisma.newsletter.upsert({
      where: { email: entry.email },
      update: {},
      create: entry,
    });
  }
  console.log(`✅ ${newsletters.length} abonnés newsletter ajoutés`);

  console.log("🎉 Seed terminé avec succès.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });