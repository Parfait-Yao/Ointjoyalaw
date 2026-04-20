import { prisma } from "../lib/prisma.ts"
import bcrypt from "bcryptjs"

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@ointjoyalaw.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email: "admin@ointjoyalaw.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN"
    }
  })
  console.log({ admin })
  console.log("Seed admin user created : admin@ointjoyalaw.com / admin123")

  // Seed organizations
  const organizations = [
    {
      name: "Let There Be Joy",
      acronym: "LTBJ",
      role: "Action Sociale",
      description: "Fondée sur le principe de partager le bonheur de Christ, LTBJ mène des actions caritatives, visite les orphelinats et apporte de l'aide aux personnes démunies.",
      websiteUrl: "https://example.com/ltbj",
    },
    {
      name: "ARMES",
      acronym: "AR",
      role: "Éducation",
      description: "Association pour la Restauration des Mœurs Étudiantes et Scolaires. Ce mouvement vise à inculquer des valeurs morales et chrétiennes à la jeunesse.",
      websiteUrl: "https://example.com/armes",
    },
    {
      name: "Mouvement Chrétien des Artistes",
      acronym: "MCA",
      role: "Arts & Culture",
      description: "Un regroupement d'artistes chrétiens dédiés à utiliser leur art pour la gloire de Dieu et l'édification de l'Église.",
      websiteUrl: "https://example.com/mca",
    },
    {
      name: "Association des Médecins Évangéliques du Salut",
      acronym: "AMES",
      role: "Santé",
      description: "Des professionnels de la santé chrétiens qui offrent des consultations gratuites et des campagnes de dépistage.",
      websiteUrl: "https://example.com/ames",
    },
  ]

  for (const org of organizations) {
    await prisma.organization.upsert({
      where: { id: `seed-${org.acronym}` }, // Use a stable ID for seeding
      update: org,
      create: {
        id: `seed-${org.acronym}`,
        ...org
      }
    })
  }
  console.log("Seed organizations created.")
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
