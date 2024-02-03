# Yapaholic

Welcome to Yapaholic! This application allows users to write anonymous posts and share anything they want. Follow the instructions below to set it up locally.

## Prerequisites

- Node.js and npm installed on your machine

## Getting Started

1. Set up and host your database tables by running the query in schema.sql.

2. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/ardamoin/yapaholic.git
    ```

3. Navigate to server directory:

    ```bash
    cd yapaholic/server
    ```

4. Install backend dependencies

    ```bash
    npm install
    ```

5. Set up the backend environment variables:

    - Create a '.env' file in the server directory.
    - Add the following environment variables:

        ```env
        MYSQL_URL=your_database_url
        JWT_SECRET=your_secret_key
        DOMAIN=your_domain_name
        CLIENT_ORIGIN=your_frontend_address
        ```
    - An optional variable 'PORT' can be added to set the port for the backend. If the variable is not declared, backend port defaults to 5000.

    Replace 'your_database_url' with the URL of your MySQL database, 'your_secret_key' with an arbitrary key for encoding and decoding tokens, 'your_domain_name' with the domain on which your backend and frontend is hosted (ex.'localhost') and 'your_frontend_address' with the URL to your frontend (ex.'http://localhost:3000').

6. Navigate to client directory:

    ```bash
    cd yapaholic/client
    ```

7. Install frontend dependencies:

    ```bash
    npm install
    ```

8. Set up the frontend environment variables:

    - Create a '.env' file in the client directory.
    - Add the following environment variable:

        ```env
        VITE_BACKEND_URL=your_backend_url
        ```

    Replace 'your_backend_url' with the URL where your backend is hosted (ex.http://localhost:5000).

9. Run frontend code from yapaholic/client: 

    ```bash
    npm run dev
    ```

10. Run backend code from yapaholic/server:

    ```bash
    npm run serverstart
    ```

11. Open your browser and go to 'http://localhost:3000' to view the app.

## Features

- Post messages on the board
- View messages posted by others
- Upgrade membership to view authors and dates of messages

## Upgrading Membership

Users can upgrade their membership with the passcode 'banana' :banana:.

## License

This project is licensed under the [MIT License](LICENSE).

Happy yapping!