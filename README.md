# URL Shortener API

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/yuvvsi/url-shortener)

A robust and scalable URL shortener service built with Spring Boot. This application provides a RESTful API for creating, managing, and tracking short URLs with detailed analytics. It features user authentication using JWT, allowing users to manage their own links and view performance metrics.

## Features

*   **User Authentication**: Secure user registration and login system using JWT (JSON Web Tokens).
*   **URL Shortening**: Generate a unique 6-character short code for any long URL.
*   **Custom Expiration**: Set an optional expiration time (in minutes) for shortened URLs.
*   **Redirection**: Fast and reliable redirection from the short URL to the original destination.
*   **Click Tracking**: Automatically logs every click, capturing IP address, User-Agent, and timestamp.
*   **Detailed Analytics**:
    *   View total clicks for a specific short URL.
    *   Get a breakdown of clicks by date for a specific URL.
    *   View aggregated analytics for all URLs owned by a user, including a list of all clicks with their details.

## Technology Stack

*   **Backend**: Java 17, Spring Boot
*   **Security**: Spring Security, JWT
*   **Database**: PostgreSQL
*   **ORM**: Spring Data JPA / Hibernate
*   **Build Tool**: Maven
*   **Containerization**: Docker

## Prerequisites

*   JDK 17 or newer
*   Maven
*   PostgreSQL
*   Docker (Optional)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yuvvsi/url-shortener.git
cd url-shortener/urlsh
```

### 2. Configure the Database

The application is configured to connect to a PostgreSQL database using environment variables. Set the following environment variables before running the application:

*   `DB_URL`: The JDBC URL of your PostgreSQL database (e.g., `jdbc:postgresql://localhost:5432/your_db_name`)
*   `DB_USERNAME`: Your database username.
*   `DB_PASSWORD`: Your database password.

Alternatively, you can directly edit the `src/main/resources/application.properties` file, but using environment variables is recommended.

### 3. Build and Run

Use the Maven wrapper to build and run the application.

**Build the project:**

```bash
./mvnw clean package -DskipTests
```

**Run the application:**

```bash
java -jar target/urlsh-0.0.1-SNAPSHOT.jar
```

The server will start on port `8080`.

## Running with Docker

You can also run the application inside a Docker container using the provided `Dockerfile`.

1.  **Build the Docker image:**

    ```bash
    docker build -t url-shortener .
    ```

2.  **Run the Docker container:**

    Make sure to pass the required database connection environment variables to the container.

    ```bash
    docker run -p 8080:8080 \
      -e DB_URL="jdbc:postgresql://<your_db_host>:<port>/<db_name>" \
      -e DB_USERNAME="<your_username>" \
      -e DB_PASSWORD="<your_password>" \
      --name urlsh-app \
      url-shortener
    ```

## API Endpoints

All endpoints are prefixed with `/api`. Endpoints that require authentication must include a `Bearer` token in the `Authorization` header.

---

### Authentication (`/api/auth`)

#### `POST /register`
Register a new user.

**Request Body:**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "password": "[ENCRYPTED_PASSWORD]",
    "authorities": [],
    "accountNonExpired": true,
    "accountNonLocked": true,
    "credentialsNonExpired": true,
    "enabled": true
}
```
---

#### `POST /login`
Authenticate a user and receive a JWT.

**Request Body:**
```json
{
    "username": "testuser",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "token": "ey...[JWT]...w0"
}
```
---

### URL Management (`/api/url`)

#### `POST /shorten`
Create a new short URL.
**Requires Authentication.**

**Request Body:**
```json
{
    "longUrl": "https://github.com/yuvvsi/url-shortener",
    "expiryMinutes": 1440
}
```
*`expiryMinutes` is optional. If not provided, the URL will not expire.*

**Response (201 Created):**
```json
{
    "shortCode": "aB1cD2",
    "longUrl": "https://github.com/yuvvsi/url-shortener",
    "expiresAt": "2024-05-22T14:30:00.000000"
}
```
---

#### `GET /{shortCode}`
Redirects to the original long URL. Also records a click event for analytics.
**Requires Authentication.**

**Example Request:**
`GET /api/url/aB1cD2`

**Response:**
*`302 Found` with `Location` header pointing to the original long URL.*
---

### Analytics (`/api/analytics`)

All analytics endpoints require authentication. The user can only see analytics for URLs they own.

#### `GET /{shortCode}/clicks`
Get the total number of clicks for a specific short URL.

**Example Request:**
`GET /api/analytics/aB1cD2/clicks`

**Response (200 OK):**
```
15
```
---

#### `GET /{shortCode}`
Get detailed analytics for a specific short URL, including total clicks and a breakdown by date.

**Example Request:**
`GET /api/analytics/aB1cD2`

**Response (200 OK):**
```json
{
    "shortCode": "aB1cD2",
    "totalClicks": 15,
    "clicksByDate": {
        "2024-05-20": 8,
        "2024-05-21": 7
    }
}
```
---

#### `GET /my-total-clicks`
Get a comprehensive report of all URLs created by the authenticated user, including total clicks and detailed information for each click event.

**Example Request:**
`GET /api/analytics/my-total-clicks`

**Response (200 OK):**
```json
{
    "totalClicks": 25,
    "urls": [
        {
            "shortCode": "aB1cD2",
            "longUrl": "https://github.com/yuvvsi",
            "totalClicks": 15,
            "clicks": [
                {
                    "timestamp": "2024-05-21T18:05:10.123456",
                    "ipAddress": "192.168.1.1",
                    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."
                },
                ...
            ]
        },
        {
            "shortCode": "xY3zW4",
            "longUrl": "https://deepwiki.com",
            "totalClicks": 10,
            "clicks": [
                {
                    "timestamp": "2024-05-20T10:15:30.987654",
                    "ipAddress": "10.0.0.5",
                    "userAgent": "curl/7.64.1"
                },
                ...
            ]
        }
    ]
}
```
---
