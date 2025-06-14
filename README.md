# 💬 Chatty - Online Chat Application

Welcome to **Chatty**, a powerful and modern full-stack chat application designed to bring people closer in real time. Whether you're chatting with friends, collaborating with teammates, or engaging in private conversations, Chatty provides a smooth, secure, and feature-rich messaging experience.

Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), Chatty combines real-time communication using **Socket.IO**, responsive UI design with **Tailwind CSS**, and a dynamic front-end powered by **React**. With support for both **group and private chats**, user profiles, online presence, dark mode, and media sharing, Chatty delivers everything you expect from a modern chat platform.

Whether you're on desktop or mobile, Chatty adapts beautifully to all screen sizes and ensures lightning-fast performance. It also includes animations via **Framer Motion**, toast notifications with **React Hot Toast**, and real-time features to make every message count.

> Start chatting instantly. Fast. Secure. Real-Time.

---

## 🚀 Live Demo

🌐 [View Chatty Online](https://chatty-sigma-virid.vercel.app)

---

## 📸 Preview

![Chatty Screenshot](https://res.cloudinary.com/dw0kaofhj/image/upload/v1749815661/Screenshot_2025-06-13_172359_onbr0o.png)

---

## 🛠️ Tech Stack

**Frontend**  
- ⚛️ React.js  
- 💨 Tailwind CSS  
- 🔄 Socket.IO (client)  
- ⚙️ React Router  
- 🧾 React Hook Form  
- ☁️ Axios
- 🎞️ Framer Motion – smooth animations & transitions  
- 🔔 React Hot Toast – elegant toast notifications

**Backend**  
- 🟢 Node.js  
- 🚂 Express.js  
- 🌿 MongoDB with Mongoose  
- 🔐 JWT Authentication  
- ♻️ Socket.IO (server)  

**Dev Tools**  
- 🧪 ESLint & Prettier  
- 🧪 Vite / Create React App  
- 🛑 Postman for API testing  
- 🔄 Nodemon  

---

## ✨ Features

- 🔐 **User Authentication** – Register, Login, Logout with JWT
- 👤 **Profile System** – Update profile with avatar, name, and bio
- 💬 **Real-Time Messaging** – Instant message delivery using Socket.IO
- 📬 **Group & Private Chats** – Switch between chat types easily
- 🤝 **Friend Request System** – Send and accept friend requests  
- 🌓 **Dark Mode Support** – Eye-friendly modern theme toggle
- 📱 **Responsive Design** – Fully optimized for mobile, tablet, and desktop
- 📁 **Media Support** – Share images, emojis, and more
- 🟢 **Online Status Indicator** – Know who's online in real-time

---

## 🧑‍💻 Author

**Satyam Sen**

- 🌐 [Portfolio](https://satyamsen.dev)  
- 📸 [Instagram](https://www.instagram.com/codekajugaad.dev/)  
- 💼 [LinkedIn](www.linkedin.com/in/satyam-sen-web-dev)

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for full details.

---

## 🤝 Contribution

We welcome contributions from the community! Here’s how you can get started:

```bash
1. Fork this repository  
2. Create a new branch: git checkout -b feature/your-feature-name  
3. Make your changes and commit: git commit -m "Add some feature"  
4. Push to the branch: git push origin feature/your-feature-name  
5. Open a Pull Request — we’ll review it and get back to you!
```

## 📁 Folder Structure (Simplified)

```bash
chatty/
├── frontend/           # React frontend (Vite or CRA)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
├── backend/        # Express backend
│   ├── src/ 
│       ├── controllers/
│       ├── helper/
│       ├── lib/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seeds/
│       └── index.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json

