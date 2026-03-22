# Sohanlal Borawar — IoT Developer Portfolio

> Personal portfolio website built with Angular 19, 
> showcasing IoT development expertise, ThingsBoard 
> projects, and real-time systems engineering.

## 🚀 Live Site
[sohanlal-borawar.vercel.app](https://sohanlal-borawar.vercel.app)

## 🛠️ Tech Stack
- **Framework**: Angular 19 (Standalone Components)
- **Animations**: GSAP + Three.js
- **Styling**: SCSS + CSS Custom Properties
- **UI**: Angular Material + Custom Clay Design System
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 19

### Installation
```bash
git clone https://github.com/sohanlal-borawar/ng-portfolio.git
cd ng-portfolio
npm install
```

### Development
```bash
# Start portfolio (localhost:4200)
npm start

# Start admin server (localhost:3001)
node admin-server.js

# Open admin panel
# http://localhost:4200/admin
# Default: admin / portfolio2024
```

### Production Build
```bash
ng build --configuration production
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔧 Admin Panel
The portfolio includes a local admin dashboard for 
updating content without editing JSON directly.

**Important**: The admin panel (`/admin`) is for 
LOCAL USE ONLY. It requires `admin-server.js` to 
be running and will show "Server offline" on the 
live deployed site — this is expected behavior.

To update portfolio content:
1. Run `node admin-server.js`
2. Run `npm start`  
3. Visit `http://localhost:4200/admin`
4. Login with your credentials
5. Edit content and save
6. Commit the updated `profile-data.json` to GitHub
7. Vercel auto-deploys the changes

## 📁 Project Structure
```
src/
├── app/
│   ├── admin/          # Local admin dashboard
│   ├── core/           # Services, models, styles
│   ├── features/       # Page sections
│   ├── layout/         # Navbar, footer
│   └── shared/         # Reusable components
├── assets/
│   ├── profile-data.json   # Portfolio content
│   └── profile-image.jpg   # Profile photo
└── index.html
```

---
Built with ❤️ using Angular 19
