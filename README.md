# MyTaxi ⚡

> AI-Powered Collaborative Code Editor — Build, collaborate, and code together in real-time.

![MyTaxi](https://img.shields.io/badge/MyTaxi-Emerald%20Edition-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io)

## ✨ Features

- 🤖 **AI-Powered Assistance** — Get code suggestions using `@ai` in the chat
- 👥 **Real-time Collaboration** — Work on projects with your team simultaneously
- 🖥️ **In-Browser Code Editor** — Write, edit, and run code directly in the browser
- 🌐 **WebContainer Integration** — Run Node.js apps directly in the browser
- 🔐 **Authentication** — Secure JWT-based auth with user management
- 🎨 **Emerald & Teal Theme** — Beautiful dark mode with premium glassmorphism UI

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.IO |
| AI | Google Generative AI (Gemini) |
| Container | WebContainer API |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Google AI API Key

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_AI_KEY=your_google_ai_key
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password" > .env

npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure
```
MyTaxi/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── db/              # Database connection
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic & AI service
│   ├── app.js           # Express app setup
│   └── server.js        # Server & Socket.IO
├── frontend/
│   ├── src/
│   │   ├── auth/        # Auth guard
│   │   ├── config/      # Axios, Socket, WebContainer config
│   │   ├── context/     # React context providers
│   │   ├── routes/      # App routing
│   │   └── screens/     # Page components
│   ├── index.html
│   └── tailwind.config.js
└── README.md
```

## 📄 License

MIT

---

Built with 💚 by MyTaxi
