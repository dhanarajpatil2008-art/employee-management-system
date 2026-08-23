# 🏢 Employee Management System (EMS)
**Final Year Diploma in Computer Engineering (CO5K - Course Code: 315004)**  
**Developer:** Dhanaraj Patil  

---

## 🌟 Project Highlights
* **Pure Full Stack MERN/PERN Architecture**: React.js (Vite) + Express.js (MVC) + MySQL Workbench.
* **Strictly 2 Tables Database Design**: `users` (Authentication & Profile) & `records` (Attendance & Leaves).
* **Role-Based Access Control (RBAC)**: Dedicated interfaces for **Admin** and **Employee**.
* **Modern Enterprise UI**: Fully responsive modern SaaS layout (Inspired by VK-LearnHub).
* **Department Analytics**: Real-time department-level employee distribution.

---

## 🗄️ Database Architecture (2 Tables Only)

### 1. `users` Table
Stores both Administrators and Employees.
* `id` (INT, Primary Key)
* `name` (VARCHAR)
* `email` (VARCHAR, Unique)
* `password` (VARCHAR - Plain text)
* `phone` (VARCHAR)
* `department` (VARCHAR)
* `designation` (VARCHAR)
* `role` (ENUM: 'admin', 'employee')
* `created_at` (TIMESTAMP)

### 2. `records` Table
Stores both daily Attendance and Leave applications via the `type` column.
* `id` (INT, Primary Key)
* `user_id` (INT, Foreign Key -> users.id)
* `type` (ENUM: 'attendance', 'leave')
* `date` (DATE - For attendance)
* `from_date` (DATE - For leave)
* `to_date` (DATE - For leave)
* `status` (VARCHAR: 'Present'/'Absent' OR 'Pending'/'Approved'/'Rejected')
* `reason` (TEXT - Leave reason or attendance remarks)
* `created_at` (TIMESTAMP)

---

## 🚀 How to Run the Project (Step-by-Step)

### Step 1: Start MySQL Database
1. Open MySQL Workbench.
2. Run the script inside `backend/database.sql`.

### Step 2: Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend runs at:* `http://localhost:5000`

### Step 3: Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at:* `http://localhost:3000`

---

## 🔑 Default Credentials for Testing

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@ems.com` | `admin123` |
| **Employee** | `ruturaj@ems.com` | `user123` |

---

## 🎓 Viva Questions & Answers (For College Presentation)

**Q1: Why did you use only 2 tables instead of 4 separate tables?**  
**Ans:** To maintain a clean and normalized database schema. Using the `type` column in `records` table allows unified tracking of employee actions (attendance and leaves) with minimal joins and fast query execution.

**Q2: How does authentication work?**  
**Ans:** When a user logs in via `/api/auth/login`, the backend verifies credentials, generates a signed **JWT (JSON Web Token)** containing the user's `id` and `role`, and sends it to the frontend. The frontend stores it in `localStorage` and includes it in the `Authorization: Bearer <token>` header for all subsequent API requests.

**Q3: How are roles protected on the frontend?**  
**Ans:** We use a `ProtectedLayout` component in React Router that inspects `user.role`. If an employee tries to open `/admin/*`, they are automatically redirected back to their employee dashboard.
