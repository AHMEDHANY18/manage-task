# Tasks API

This project provides a RESTful API for managing Tasks and Categories. Users can organize their tasks into categories, specify task visibility, and perform CRUD operations on both categories and tasks. Basic authentication is implemented using HTTP Basic Authentication.

## Technologies Used

- **Node.js**: Backend server environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing data
- **Mongoose**: MongoDB object modeling for Node.js
- **Joi**: Schema validation for JavaScript objects
- **bcryptjs**: Password hashing library for user authentication
- **jsonwebtoken**: JWT (JSON Web Token) for token-based authentication
- **dotenv**: Environment variable management
- **Postman**: API testing tool (for testing endpoints)

## Features

- **User Authentication**: Basic HTTP Authentication with username and password.
- **Categories**: Users can create, read, update, and delete categories.
- **Tasks**: Users can create, read, update, and delete tasks, which can be of two types: Text Tasks or List Tasks.
- **Visibility**: Tasks can be either shared (public) or private.
- **Pagination**: Implemented for fetching tasks and categories.
- **Filtering**: Supported by category name and task visibility (public/private).
- **Sorting**: Supported by category name and task visibility.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd tasks-api
