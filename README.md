# 📱 DaSocial
La piattaforma sociale ufficiale del **Liceo Da Vinci**.  
App reattiva, minimale e professionale — sviluppata come **PWA** con React + Vite + Supabase.

---

## 🚀 Caratteristiche principali (MVP)

### ✔ Autenticazione
- Login
- Registrazione con username validato
- Reset password
- UI coerente e moderna
- Pronto per integrazione Supabase Auth

### ✔ Bacheca
- Feed post con:
  - autore
  - testo
  - immagini
  - like
  - commenti + risposte (1 livello)
- Mock data già implementati
- UI minimal, 100% width, stile social moderno

### ✔ Design
- Componenti React + CSS Modules
- Palette colori “DaSocial” con variabili globali
- Layout perfetto su mobile
- Icone `lucide-react`
- Nessun bordo arrotondato, look professionale

### ✔ PWA-ready
- `manifest.json`
- icone PWA
- service worker via `vite-plugin-pwa`
- modalità offline
- installabile su Android / iOS / Desktop

---

## 🛠 Stack Tecnologico

**Frontend**
- React + Vite
- CSS Modules
- lucide-react icons
- Vite PWA Plugin

**Backend (previsto)**
- Supabase:
  - Auth
  - Database PostgreSQL
  - Storage (immagini post + documenti)
  - Policies (RLS)

---

## 📁 Struttura progetto

src/
├─ components/
│ ├─ Header.jsx
│ ├─ TopTabs.jsx
│ ├─ BottomNav.jsx
│ ├─ Post.jsx
│ └─ ...
│
├─ pages/
│ ├─ Login.jsx
│ ├─ Register.jsx
│ ├─ ForgotPassword.jsx
│ └─ Home.jsx
│
├─ styles/
│ ├─ reset.css
│ ├─ global.css
│ ├─ colors.css
│ └─ ...
│
├─ App.jsx
└─ main.jsx

🧩 To-do Roadmap
🔥 MVP Core

 Integrazione Login + Register con Supabase Auth

 Routing (React Router)

 Creazione post (testo + immagine)

 Visualizzazione post da database

 Sistema di ruoli (studenti / rappresentanti)

🔔 Feature future

 Notifiche push (PWA + Supabase Edge)

 Mercatino libri usati

 Broadcast ufficiali dei rappresentanti

 Moderazione (report, soft delete)

 Uso codice-classe per registrazione sicura


📄 Licenza
MIT License.