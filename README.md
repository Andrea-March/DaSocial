# 📱 DaSocial — Social Network Open-Source per le Scuole

DaSocial è una piattaforma social moderna pensata per istituti scolastici: feed, post con immagini, broadcast ufficiali, commenti, like, permessi avanzati e integrazione con Supabase.

Progettata per essere semplice da installare, personalizzabile, e open-source.

## ✨ Funzionalità

📰 Feed dei post con immagini, testo e like

❤️ Like con contatore in tempo reale

💬 Commenti (architettura già pronta)

📣 Broadcast con permessi per rappresentanti / admin

📌 Pin / Unpin dei broadcast

📅 Eventi con data dedicata

🗂 Modali eleganti per edit/delete

🖼 Upload immagini con compressione & cleanup automatico

🔐 Supabase (Auth, Storage, RLS avanzate)

⚡ UI moderna e responsive

## 🛠 Tech stack

React + Vite

Supabase (Postgres, Auth, Storage, RLS)

CSS Modules

Lucide Icons

## 🚀 Avvio locale
### 1️⃣ Clona la repo
git clone https://github.com/Andrea-March/DaSocial.git
cd dasocial

### 2️⃣ Installa le dipendenze
npm install

### 3️⃣ Configura l’ambiente

Crea un file .env basato su .env.example:

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

### 4️⃣ Avvio in sviluppo
npm run dev

## 🧩 Configurazione Supabase

Importa lo schema contenuto in /supabase/schema.sql (opzionale).

Assicurati che:

✔ la tabella profiles sia sincronizzata con gli utenti
✔ le RLS delle tabelle posts e broadcasts siano attive
✔ i bucket Storage: posts/ e broadcasts/ esistano
✔ siano presenti le RPC:

update_post_get_full

update_broadcast_get_full

## 🤝 Contribuire

Le PR sono benvenute!
Guarda la sezione Issues per idee e miglioramenti.

# 📄 Licenza

Rilasciato sotto licenza MIT.
Puoi usarlo liberamente per scuole, istituti o progetti personali.