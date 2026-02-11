# 🌾 Farmer Brand – Full Stack (Node.js Integrated API)

![Flutter](https://img.shields.io/badge/Flutter-Mobile%20App-blue?logo=flutter)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-API-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Vercel](https://img.shields.io/badge/Web-Hosted%20on%20Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📌 Project Overview

**Farmer Brand** is a full-stack farmer-to-consumer digital marketplace built with:

- 🌐 Responsive Web Frontend  
- 📱 Flutter Mobile Application  
- ⚙️ Node.js + Express REST API  
- 🗄️ MongoDB Database  

The platform enables farmers to directly list and sell agricultural products to customers, eliminating middlemen and improving profitability.

---

# 🚀 Backend Integration (Node.js REST API)

The project now includes a fully integrated **Node.js backend API** supporting authentication, product management, and order handling.

---

## 🔐 Authentication System

- JWT-based authentication  
- Secure password hashing using bcrypt  
- Role-based access control (Farmer / Customer / Admin)  
- Protected API routes using middleware  

### Auth APIs

- `POST /api/register`
- `POST /api/login`
- `GET /api/profile`

---

## 🌾 Product Management APIs

Farmers can:

- Add products  
- Update product details  
- Upload product images  
- Delete products  
- Manage stock & pricing  

### Product APIs

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

---

## 🛒 Order Management System

Customers can:

- Add items to cart  
- Place orders  
- Track order status  

### Order Status Flow

- 🟡 Pending  
- 🔵 Confirmed  
- 🚚 Shipped  
- 🟢 Delivered  
- 🔴 Cancelled  

### Order APIs

- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id/status`

---

## 🗄️ Database Structure (MongoDB)

Collections:

- Users  
- Products  
- Orders  
- Categories  

Structured schema design for scalability and performance.

---

# 📱 Frontend Integration

### 🌐 Web (HTML + Bootstrap)
- Connected to Node.js REST APIs
- Dynamic product listing
- API-based product rendering

### 📱 Flutter App
- REST API integration using HTTP/Dio
- JWT token storage
- Real-time product fetch
- Role-based UI rendering

---

# 🏗️ Architecture Overview

```
Frontend (Web / Flutter)
           ↓ REST API
Node.js + Express Server
           ↓
MongoDB Database
```

- Modular backend structure  
- Secure middleware authentication  
- Scalable REST architecture  

---

# 🛠️ Tech Stack

## 🎨 Frontend
- HTML
- CSS
- JavaScript
- Bootstrap
- Flutter (Mobile App)

## ⚙️ Backend
- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt
- Multer (Image Upload)

---

# 🎯 Key Achievements

- Secure JWT authentication flow  
- Full CRUD API integration  
- Role-based system architecture  
- Farmer-to-customer direct marketplace model  
- Scalable backend structure  

---

# 🔮 Future Enhancements

 
- Admin analytics dashboard  
- Push notification system  
- Docker deployment  
- CI/CD pipeline  

---

## 📄 License

This project is licensed under the MIT License.
