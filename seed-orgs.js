const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const organizations = [
    {
      name: "Let There Be Joy",
      acronym: "LTBJ",
      role: "Action Sociale",
      description: "Fondée sur le principe de partager le bonheur de Christ, LTBJ mène des actions caritatives.",
      websiteUrl: "https://example.com/ltbj",
    },
    {
      name: "ARMES",
      acronym: "AR",
      role: "Éducation",
      description: "Association pour la Restauration des Mœurs Étudiantes et Scolaires.",
      websiteUrl: "https://example.com/armes",
    },
    {
      name: "Mouvement Chrétien des Artistes",
      acronym: "MCA",
      role: "Arts & Culture",
      description: "Un regroupement d'artistes chrétiens dédiés à utiliser leur art pour la gloire de Dieu.",
      websiteUrl: "https://example.com/mca",
    },
    {
      name: "Association des Médecins Évangéliques du Salut",
      acronym: "AMES",
      role: "Santé",
      description: "Des professionnels de la santé chrétiens qui offrent des consultations gratuites.",
      websiteUrl: "https://example.com/ames",
    },
  ];

  for (const org of organizations) {
    // Upsert or Create? Create is simpler, but if they exist it might duplicate?
    // Let's use findFirst then create
    const existing = await prisma.organization.findFirst({ where: { acronym: org.acronym } });
    if (!existing) {
      await prisma.organization.create({ data: org });
      console.log("Created: " + org.name);
    } else {
      console.log("Already exists: " + org.name);
    }
  }
  console.log("Seeded!");
}
seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) });
