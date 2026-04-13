# Ointjoyalaw Ministries - Plateforme Web

Bienvenue sur le dépôt du projet **Ointjoyalaw Ministries**. Il s'agit d'une plateforme web moderne et complète conçue pour gérer les activités de l'église, la diffusion des enseignements, la gestion des événements et un espace d'administration sécurisé.

🌍 **Lien Visiteurs :** [https://ointjoyalaw.vercel.app/](https://ointjoyalaw.vercel.app/)

## 🚀 Fonctionnalités Principales

### 🌐 Section Publique (Visiteurs)
- **Présentation du Ministère** : Sections dédiées à l'équipe, la vision et les activités de l'église.
- **Enseignements & Médias** : Grille dynamique d'enseignements filtrables par catégorie (Vidéos YouTube, PDF, Audio).
- **Événements & Billetterie** : Calendrier des événements avec possibilité de réserver des tickets (génération de billets PDF avec QR Codes).
- **Dons & Paiements en ligne** : Système de dons et de paiements sécurisés.
- **Newsletter** : Inscription fluide à la lettre d'information.

### 🛡️ Espace Administration (Sécurisé)
- **Tableau de Bord** : Vue d'ensemble des statistiques de la plateforme.
- **Gestion des Événements** : Création, modification et suppression d'événements, suivi des inscriptions.
- **Gestion des Enseignements** : Ajout et organisation des ressources multimédias.
- **Suivi des Paiements** : Historique des dons et des paiements de billets.
- **Mailing / Newsletter** : Gestion de la liste des abonnés.

## 🛠️ Stack Technique

Ce projet est construit avec des technologies modernes pour garantir des performances optimales et une excellente expérience développeur :

- **Framework** : [Next.js](https://nextjs.org/) (App Router) / React 19
- **Base de données / ORM** : [Prisma](https://www.prisma.io/) avec PostgreSQL
- **Authentification** : NextAuth.js
- **Stylisation** : Tailwind CSS v4, Base UI, composants Radix UI / shadcn
- **Paiements** : Intégration Stripe (et/ou CinetPay)
- **Médias & Notifications** : Cloudinary (Images), Resend (Emails)

## 💻 Installation & Démarrage local

> **Note :** Les clés de sécurité et d'API ne sont pas fournies ici afin de respecter la sécurité du projet en production.

### 1. Prérequis
- Node.js (version 18+ recommandée)
- Un gestionnaire de paquets (npm, yarn, ou pnpm)
- Une base de données PostgreSQL

### 2. Clonage et dépendances
```bash
# Cloner le projet (si hébergé sur Git)
git clone [URL_DU_DEPOT]

# Naviguer dans le dossier
cd church

# Installer les dépendances
npm install
```

### 3. Variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez les variables requises (demander à l'administrateur pour les valeurs exactes) :
```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/church_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_cle_secrete_ici"

# Autres services externes (À remplir)
STRIPE_PUBLIC_KEY="..."
STRIPE_SECRET_KEY="..."
CLOUDINARY_URL="..."
RESEND_API_KEY="..."
```

### 4. Configuration de la Base de données
```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma dans la base de données
npx prisma db push
# (Ou `npx prisma migrate dev` selon la stratégie adoptée)
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```
Le projet sera accessible sur [http://localhost:3000](http://localhost:3000).

## 📄 Licence
Projet privé - Tous droits réservés à Ointjoyalaw Ministries.
