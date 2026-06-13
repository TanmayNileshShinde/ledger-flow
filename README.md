# 💳 LedgerFlow

**Financial clarity for your most complex projects.**

LedgerFlow is a secure, real-time financial tracking dashboard designed to manage heavy installments, fluid freelance contracts, and complex milestone-based payments. It partitions financial data into isolated workspaces with dynamic tracking and real-time aggregate computation.

![LedgerFlow Architecture](https://img.shields.io/badge/Architecture-v2.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Firebase](https://img.shields.io/badge/Firebase-v10-yellow)

---

## ✨ Key Features

* **Isolated Workspaces:** Keep distinct revenue streams and property investments completely partitioned and perfectly organized.
* **Master-Detail Views:** Get a 10,000-foot aggregate view of total tracked capital, settled amounts, and outstanding liabilities, or drill down into individual ledger rows.
* **Bank-Grade Validation:** Built-in input clamping prevents over-payments and math-breaking typos.
* **Real-Time State Synchronization:** Powered by Firebase `onSnapshot` WebSockets, ensuring the master dashboard instantly reflects payments made in child projects.
* **Premium Glassmorphism UI:** Built with Tailwind CSS, featuring ambient gradient meshes, deep inner shadows, and fluid micro-interactions.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Routing:** React Router v6
* **Authentication:** Firebase Auth (Google OAuth)
* **Database:** Cloud Firestore (NoSQL)

---

## 🚀 Getting Started

Follow these instructions to run the project securely on your local machine.

### 1. Clone the Repository
``` 
   git clone https://github.com/YOUR_USERNAME/ledger-flow.git 
   cd ledger-flow
```

### 2. Install Dependencies
``` 
npm install
``` 

### 3. Environment Setup
For security, Firebase API keys are not tracked in version control. Create a `.env` file in the root directory and add your Firebase configuration:

``` env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"
``` 

### 4. Run the Development Server
``` 
npm run dev
``` 
The application will be available at `http://localhost:5173`.

---

## 🔒 Security Notes
* Database read/write access is strictly protected via **Firestore Security Rules**, requiring active Google Authentication.
* User data is isolated natively; queries explicitly filter by `userId` to prevent cross-tenant data leakage.

## 👤 Contact
Tanmay Nilesh Shinde

GitHub: https://github.com/TanmayNileshShinde

LinkedIn: https://www.linkedin.com/in/tanmay-shinde-9b07753bb
