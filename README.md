# War Economic Impact Dashboard

A full-stack web application designed to analyze, visualize, and report the economic impacts of global conflicts. This dashboard provides interactive data visualizations, comparative analysis, and comprehensive insights for researchers, economists, and policymakers.

## 🚀 Features

- **Interactive Dashboard:** Dynamic charts and graphs displaying key economic indicators (GDP, inflation, unemployment) affected by conflicts.
- **Data Comparison:** Side-by-side analysis of different regions or time periods.
- **User Authentication:** Secure login using JWT and Google OAuth integration.
- **Profile Management:** Users can manage their profile, including avatar uploads via Cloudinary.
- **AI Integration:** Leverage Groq and Gemini APIs for intelligent data insights.
- **Responsive UI:** A modern, visually appealing interface built with React and Tailwind CSS.

## 📸 Screenshots

![Dashboard Overview](screenshots/dashboard.png)
*Figure 1: Main Dashboard displaying economic indicators.*

![Comparison View](screenshots/comparison.png)
*Figure 2: Comparing the economic impact across different regions.*

![User Profile](screenshots/profile.png)
*Figure 3: User Profile management and settings.*

*(Note: Please create a `screenshots` folder in the root directory and add `dashboard.png`, `comparison.png`, and `profile.png` to display the images here)*

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Recharts (Data Visualization)
- EmailJS

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Cloudinary (Image Uploads)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd war_economic_impact_dataset_rituraj_jha
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```bash
     cp .env.example .env
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🔒 Environment Variables

Refer to the `.env.example` files in both the `backend` and `frontend` directories for the required environment variables. Ensure that you do not commit your actual `.env` files to version control.