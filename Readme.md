Portfolio Backend API
=====================

Live Deployment
---------------

*   [Backend API](https://next-prisma-portfolio-backend.vercel.app/)
*   [Frontend Application](https://nextjs-prisma-portfolio-frontend.vercel.app/)

Project Overview
----------------

This is the backend API for a modern portfolio website, designed to manage authentication, blogs, and projects. It provides RESTful endpoints to handle user authentication, CRUD operations for blog posts, and CRUD operations for project details, integrated with a PostgreSQL database via Prisma ORM. The API is secured with JWT-based authentication and includes input validation for robust data handling.

### Key Features

*   **Authentication**: JWT-based login system with bcrypt password hashing.
*   **Blog Management**: Create, read, update, and delete blog posts with unique slugs.
*   **Project Management**: Create, read, update, and delete projects with flexible features array handling.
*   **Input Validation**: Uses Zod for schema validation to ensure data integrity.
*   **Database Integration**: Prisma ORM for efficient PostgreSQL database interactions.
*   **CORS Support**: Configured to allow requests from the frontend application.
*   **Seeding**: Automatic admin user creation on first run if no users exist.
*   **Error Handling**: Comprehensive error handling with meaningful responses.

Technology Stack
----------------

*   **Node.js**: JavaScript runtime for the server.
*   **Express.js**: Web framework for building RESTful APIs.
*   **Prisma ORM**: For database management and querying.
*   **PostgreSQL**: Relational database for storing user, blog, and project data.
*   **TypeScript**: For type-safe development.
*   **JWT**: JSON Web Tokens for secure authentication.
*   **bcrypt**: For password hashing.
*   **Zod**: For runtime schema validation.
*   **slugify**: For generating URL-friendly slugs for blog posts.
*   **Vercel**: For hosting and automatic scaling.
*   **Git & GitHub**: Version control and source code management.

Setup Instructions
------------------

Follow these steps to set up the backend API locally.

### Prerequisites

*   **Node.js**: Version 18.x or higher.
*   **npm** or **yarn**: For package management.
*   **PostgreSQL**: Local or cloud-based database instance.
*   **Git**: For cloning the repository.

### Installation

1.  **Clone the Repository**:
    
        git clone https://github.com/mahadi-zulfiker/Nextjs-Prisma-Portfolio-Backend
        cd Nextjs-Prisma-Portfolio-Backend
    
2.  **Install Dependencies**:
    
        npm install
        # or
        yarn install
    
3.  **Set Up Environment Variables**:
    
    Create a `.env` file in the project root and add:
    
        PORT=5000
        DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
        JWT_SECRET=your_jwt_secret
    
    Replace `user`, `password`, and `portfolio` with your PostgreSQL credentials and database name.
    
4.  **Run Database Migrations**:
    
        npx prisma migrate dev
    
5.  **Seed the Database**:
    
    The admin user will be automatically seeded on first run with:
    
    *   Email: `admin@example.com`
    *   Password: `password123`
6.  **Run the Development Server**:
    
        npm run dev
        # or
        yarn dev
    
    The API will be available at `http://localhost:5000`.
    
7.  **Build for Production**:
    
        npm run build
        npm start
        # or
        yarn build
        yarn start
    

### Project Structure

    portfolio-backend/
    ├── src/
    │   ├── controllers/             # API logic for auth, blogs, and projects
    │   ├── middlewares/            # Authentication middleware
    │   ├── routes/                 # Express route definitions
    │   ├── tools/                  # Utility scripts (e.g., combine-selected-modules.js)
    │   ├── utils/                  # Helper functions (e.g., seed.ts)
    │   └── index.ts                # Main server entry point
    ├── prisma/
    │   └── schema.prisma           # Prisma schema for database models
    ├── .env                        # Environment variables
    ├── package.json                # Dependencies and scripts
    └── README.md                   # Project documentation
    

API Endpoints
-------------

### Authentication

*   **POST /api/auth/login**: Authenticate a user and return a JWT token.
    
        Request Body:
        {
          "email": "admin@example.com",
          "password": "password123"
        }
        Response:
        {
          "token": "jwt_token"
        }
    

### Blogs

*   **GET /api/blogs**: Fetch all blog posts.
*   **GET /api/blogs/:slug**: Fetch a blog post by slug.
*   **POST /api/blogs**: Create a new blog post (requires authentication).
    
        Request Body:
        {
          "title": "Blog Title",
          "content": "Blog content"
        }
    
*   **PUT /api/blogs/:id**: Update a blog post (requires authentication).
*   **DELETE /api/blogs/:id**: Delete a blog post (requires authentication).

### Projects

*   **GET /api/projects**: Fetch all projects.
*   **POST /api/projects**: Create a new project (requires authentication).
    
        Request Body:
        {
          "title": "Project Title",
          "description": "Project description",
          "features": ["Feature 1", "Feature 2"],
          "thumbnail": "https://example.com/image.jpg",
          "liveLink": "https://example.com",
          "repoLink": "https://github.com/example"
        }
    
*   **PUT /api/projects/:id**: Update a project (requires authentication).
*   **DELETE /api/projects/:id**: Delete a project (requires authentication).

Additional Notes
----------------

*   **Authentication**: Protected routes require a Bearer token in the Authorization header (e.g., `Authorization: Bearer jwt_token`).
*   **Database**: Ensure the Prisma schema (`prisma/schema.prisma`) is up-to-date with migrations applied before running the server.
*   **Security**: Use a strong `JWT_SECRET` in production and store it securely in environment variables.
*   **CORS**: Configured to allow requests from `https://nextjs-prisma-portfolio-frontend.vercel.app` and local development origins. Update in production as needed.
*   **Utilities**: The `combine-selected-modules.js` script aggregates source files for documentation or analysis purposes.
*   **Testing**: Consider adding unit tests with Jest for controllers and integration tests for API endpoints.
*   **Deployment**: Optimized for Vercel, but can be deployed to other platforms like Heroku or AWS with appropriate configuration.

Contributing
------------

Contributions are welcome! Please:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m "Add your feature"`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

License
-------

This project is licensed under the MIT License.