# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


## Mise en service de Center Warm Stay

Le site Vite est compilé avec `npm run build -- --base ./`. Sur un domaine HTTPS dédié, déployer le dossier `dist` à la racine de ce domaine. La page de gestion est `/gestion.html`.

1. Configurer `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` et `VITE_BOOKING_SITE_ORIGIN` d’après `.env.example`. L’origine exacte inclut le protocole et le domaine, sans slash final. Pour l’appel public de la fonction avec vérification JWT activée, renseigner `VITE_SUPABASE_FUNCTION_ANON_JWT` avec la clé **anon** JWT historique. La clé `service_role` reste dans Supabase.
2. Dans Supabase Authentication, créer et vérifier le compte du propriétaire. Une fois le compte vérifié, ajouter son UUID à `public.rental_admins.user_id` par une opération d’administration. Les comptes ordinaires ne peuvent pas s’ajouter à cette liste.
3. Dans l’espace de gestion, vérifier les tarifs, les photos et les informations du logement principal, puis le publier. Les autres logements restent en brouillon jusqu’à leur publication.
4. Configurer dans Supabase Edge Functions le secret `BOOKING_SITE_ORIGIN` avec la même origine dédiée. La fonction `reservation-request` reste inactive tant que ce secret manque. Tester la soumission, la confirmation et le téléchargement du contrat avec des données fictives avant d’ouvrir la réception. Configurer les limites anti-abus de l’hébergeur et la durée de conservation des contrats avant de collecter de vraies pièces d’identité.

Les contrats restent dans le stockage privé `rental-agreements`, accessible aux comptes autorisés. Les photos de logements envoyées au bucket `rental-photos` sont des médias publics, même pour les brouillons. Les demandes restent en attente jusqu’à confirmation. L’envoi d’e-mails est une intégration distincte.

La compilation sans variables utilise le mode démonstration et les simulations restent dans le navigateur.

### Déploiement Netlify

Importer le dépôt GitHub et choisir la branche de production `codex/parcours-reservation`.
Netlify utilise `netlify.toml` pour compiler et publier `dist`. Le mode connecté est
réservé à `https://centerwarmstay.com`, à définir comme domaine principal dans Netlify.
Les URL temporaires de déploiement restent en mode démonstration.

Conserver le DNS chez le registraire et appliquer les valeurs affichées dans le panneau
de vérification DNS du projet Netlify. Conserver les enregistrements MX et TXT du mail.
Une fois le HTTPS fonctionnel, vérifier la connexion à `/gestion.html` sur le domaine
et tester la réception des réservations avant d’ouvrir le formulaire aux clients.
