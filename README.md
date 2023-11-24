# Thrindle Engineering Test

## How to run/test this project
* ensure you have git installed properly on your machine
* ensure you have node.js installed on your machine
* open your terminal and run `git clone git@github.com:debeemedia/thrindle_api.git`
* run "npm install"
* run "npm start" to start the server, "npm run dev" to start the server with nodemon
* run "npm test" to test
* see .example.env file for necessary environment variables

## Documentation

### Base URL
The base URL for this API is https://thrindle-debee.onrender.com/api

### Encryption
User passwords are securely salted and hashed before being stored in the database.

### Authentication
Authentication is managed with JSON Web Tokens (JWTs).

### Error Handling
In case of errors, the API responds with appropriate HTTP status codes and informative error messages.

### Endpoints

#### Register a User
* Endpoint: /users/register
* Method: POST
* Description: Allows a user to register.
* Parameters:
 Request body: a JSON object with the keys email, username, password, first_name, last_name, phone_number (all mandatory).
* Example of request body:
```
{
  "email": "user@example.com",
  "username": "example_user",
  "password": "password123",
  "first_name": "Alaye",
  "last_name": "Lagbaja",
  "phone_number": "08012419419"
}
```

* Response:
Status Code: 201 (Created); a JSON Object
```
{
  "success": true,
  "message": "User registration successful"
}
```

Status Code: 400 (Bad Request)
```
{
  "success": false,
  "message": "Email already exists"
}
```

Status Code: 400 (Bad Request)
```
{
  "success": false,
  "message": "Username already exists"
}
```

#### Log In
* Endpoint: /users/login
* Method: POST
* Description: Allows a registered user to log in.
* Parameters:
 Request body: a JSON object with keys password (mandatory) and either username or email (one of them mandatory).
* Examples of request body:
```
{
 "email": "user@example.com",
 "password": "password123"
}
```

```
{
 "username": "example_user",
 "password": "password123"
}
```

* Response:
Status Code: 200 (OK)
```
{
  "success": true,
  "message": token
}
```

Status Code: 401 (Unauthorized)
```
{
 "success": false,
 "message": "Incorrect credentials"
}
```

Status Code: 403 (Forbidden)
```
{
 "success": false,
 "message": "User is not verified"
}
```

Status Code: 404 (Not Found)
```
{
 "success": false,
 "message": "User is not registered"
}
```