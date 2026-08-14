# Product Management System

A full-stack Product Management System developed as part of an internship evaluation assignment.

The application provides CRUD operations for Product Categories, Product Subcategories, and Products, with proper relationships between the entities.

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- REST APIs

### Frontend
- React
- JavaScript
- HTML
- CSS
- Vite

## Project Structure

```text
Product Management/
│
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com.neophron.productmanagement/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── repository/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       └── config/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
