# Sistem Pantau Karyawan (SIPAKAR) API Documentation

Sistem Pantau Karyawan (SIPAKAR) adalah aplikasi untuk memantau karyawan dalam suatu organisasi. API ini menyediakan beberapa endpoint untuk mengelola data karyawan, absensi, dan manajemen peran. Pengguna harus melakukan otentikasi dengan menggunakan token JWT untuk mengakses endpoint tertentu.

## Prasyarat

1. **Node.js** dan **npm** diinstal di lokal.
2. **Database MySQL** dengan skema yang sesuai.
# Database Schema

## Table: `attendance`
This table stores attendance records for users.

| Column     | Type          | Null | Key | Default           | Description |
|------------|---------------|------|-----|-------------------|-------------|
| `id`       | int(11)       | NO   | PRI |                   | Primary key |
| `user_id`  | int(11)       | NO   | MUL |                   | Foreign key referencing `users` table |
| `date`     | date          | NO   |     |                   | Date of attendance |
| `time_in`  | time          | YES  |     | NULL              | Time of clock-in |
| `photo_in` | varchar(255)  | YES  |     | NULL              | Path to photo taken at clock-in |
| `created_at`| timestamp    | NO   |     | current_timestamp() | Record creation timestamp |

### Indexes for `attendance`
- `PRIMARY KEY (id)`
- `KEY user_id (user_id)`

### Constraints for `attendance`
- `FOREIGN KEY (user_id)` references `users(id)`

---

## Table: `employees`
This table stores employee information related to users.

| Column    | Type         | Null | Key | Default | Description |
|-----------|--------------|------|-----|---------|-------------|
| `id`      | int(11)      | NO   | PRI |         | Primary key |
| `user_id` | int(11)      | YES  | MUL | NULL    | Foreign key referencing `users` table |
| `division`| varchar(100) | NO   |     |         | Division name |

### Indexes for `employees`
- `PRIMARY KEY (id)`
- `KEY user_id (user_id)`

### Constraints for `employees`
- `FOREIGN KEY (user_id)` references `users(id)` on delete CASCADE

---

## Table: `roles`
This table stores the roles available in the system.

| Column      | Type          | Null | Key | Default | Description |
|-------------|---------------|------|-----|---------|-------------|
| `id`        | int(11)       | NO   | PRI |         | Primary key |
| `role_name` | varchar(100)  | NO   |     |         | Role name (e.g., 'Admin', 'User') |

### Indexes for `roles`
- `PRIMARY KEY (id)`

---

## Table: `users`
This table stores user information and links to their respective roles.

| Column      | Type          | Null | Key | Default           | Description |
|-------------|---------------|------|-----|-------------------|-------------|
| `id`        | int(11)       | NO   | PRI |                   | Primary key |
| `name`      | varchar(255)  | NO   |     |                   | User's full name |
| `email`     | varchar(255)  | NO   | UNI |                   | User's email address (unique) |
| `password`  | varchar(255)  | NO   |     |                   | Encrypted password |
| `role_id`   | int(11)       | YES  | MUL | 2                 | Foreign key referencing `roles(id)` (default role is 'User') |
| `created_at`| timestamp     | NO   |     | current_timestamp() | Record creation timestamp |
| `updated_at`| timestamp     | NO   |     | current_timestamp() on update current_timestamp() | Record update timestamp |

### Indexes for `users`
- `PRIMARY KEY (id)`
- `UNIQUE KEY email (email)`
- `KEY role_id (role_id)`

### Constraints for `users`
- `FOREIGN KEY (role_id)` references `roles(id)` on delete SET NULL on update CASCADE

---

3. **Environment Variables**:
   - `JWT_SECRET`:

## Instalasi

1. Clone repositori ini:

   -API
   ```bash
   git clone https://github.com/siburianbasrunki/sipakar-api.git
   ```
   -Front-End

```bash
 https://github.com/siburianbasrunki/Sipakar.git
```

2. Masuk ke direktori proyek:

   ```bash
   cd sipakar-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Buat file `.env` di root direktori proyek dan tambahkan variabel lingkungan berikut:

   ```env
   JWT_SECRET=your_jwt_secret_key
   ```

5. Jalankan server:
   ```bash
   npm start
   ```

## Otentikasi

Semua rute yang terproteksi memerlukan header `Authorization` dengan format berikut:

```bash
Authorization: Bearer <token>
```

Token diperoleh setelah pengguna berhasil login.

---

## Endpoint API

### 1. **Login**

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Deskripsi**: Endpoint ini digunakan untuk login pengguna.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "qwertyre",
    "role": "user|admin"
  }
  ```

---

### 2. **Get All Employees**

- **URL**: `/api/employees`
- **Method**: `GET`
- **authorization**: Beares Token (yang didapat ketika login)
- **Response**:
  `json
     [
    {
        "id": 10,
        "name": "dia",
        "email": "dia@gmail.com",
        "division": "IT"
    }
]
     `

---

### 3. **Create Employee**

- **URL**: `/api/employees`
- **Method**: `POST`
- **authorization**: Beares Token (yang didapat ketika login)
- **Request Body**:
  ```json
  {
    "name": "name",
    "email": "name@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Employee created successfully."
  }
  ```

---

### 4. **Update Employee**

- **URL**: `/api/employees/:id`
- **Method**: `PUT`
- **authorization**: Beares Token (yang didapat ketika login)
- **Request Body**:
  ```json
  {
    "name": "nameupdate",
    "email": "emailupdate@example.com",
    "division": "division"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Employee updated successfully."
  }
  ```

---

### 5. **Delete Employee**

- **URL**: `/api/employees/:id`
- **Method**: `DELETE`
- **authorization**: Beares Token (yang didapat ketika login)
- **Response**:
  ```json
  {
    "message": "Employee deleted successfully."
  }
  ```

---

### 6. **Get Employee Attendance**

- **URL**: `/api/attendance`
- **Method**: `GET`
- **authorization**: Beares Token (yang didapat ketika login)
- **Response**:

  ```json
  [
    {
      "id": 6,
      "date": "2024-09-06T17:00:00.000Z",
      "time_in": "05:51:59",
      "photo_in": "https://res.cloudinary.com/.....",
      "name": "name",
      "email": "name@gmail.com"
    }
  ]
  ```

---

### 11. **Logout**

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Deskripsi**: Logout pengguna. (Menghapus token dari client-side)
- **Response**:
  ```json
  {
    "message": "Logged out successfully."
  }
  ```

---
