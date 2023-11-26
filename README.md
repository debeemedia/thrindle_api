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

#### USERS:

##### Register a User
NB: Email (with verification link) is sent to the user on successful registration

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
  "message": "Please provide required fields"
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

##### Log In
* Endpoint: /users/login
* Method: POST
* Description: Allows a registered and verified user to log in (NB: Click the verification link sent in the mail on registration to get verified)
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
A token is sent in the response.message; this token expires in 1 hour and must be provided in the headers as Authorization for protected routes
```
{
  "success": true,
  "message": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjFkOTdiMjJkZmY3OGU4ZGRmYjg0MSIsInVzZXJuYW1lIjoiZGViZWUiLCJpYXQiOjE3MDA5MTMwMjcsImV4cCI6MTcwMDkxNjYyN30.hWaUuR7VuvWmFwgvtzI7qyA7emYvaDUIz8S80UpQMuQ"
}
```
NB: The token above is just a sample

Status Code: 400 (Bad Request)
```
{
  "success": false,
  "message": "Please provide login details"
}
```

Status Code: 401 (Unauthorized)
```
{
 "success": false,
 "message": "Incorrect credentials"
}
```

Status Code: 401 (Unauthorized)
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
  "message": "User not found"
}
```

##### Authorization
* Authorization is handled with JWT. The token expires in 1 hour and must be provided in the headers as Authorization for protected routes
* Response: Below are returned responses when accessing protected routes
- When no token is provided:
Status Code: 401 (Unauthorized)
```
{
  "success": false,
  "message": "Unauthorized. Please login"
}
```
- When the token is invalid:
Status Code: 401 (Unauthorized)
```
{
  "success": false,
  "message": "invalid signature"
}
```
Status Code: 401 (Unauthorized)
```
{
  "success": false,
  "message": "invalid token"
}
```
- When the token has expired:
Status Code: 401 (Unauthorized)
```
{
  "success": false,
  "message": "jwt expired"
}
```

#### TRANSACTIONS:
NB: Email is sent to the user when a transaction is initiated, succeeds or fails.

##### Initiate a Transaction
* Endpoint: /transactions/create
* Method: POST
* Description: Allows a logged-in user to create a transaction
* Parameters:
 Request body: a JSON object with the key amount (mandatory).
* Example of request body:
```
{
  "amount": 1
}
```

* Response:
Status Code: 201 (Created); a JSON Object
```
{
  "success": true,
  "message": "Transaction created successfully",
  "paymentInitiation": {
    "status": "success",
    "message": "Charge initiated",
    "meta": {
      "authorization": {
        "transfer_reference": "FLW-9b838c10a19a4bcf9b6acaa9bcf061fb",
        "transfer_account": "9466537890",
        "transfer_bank": "WEMA BANK",
        "account_expiration": "2023-11-25 14:23:21",
        "transfer_note": "Please make a bank transfer to Thrindle FLW",
        "transfer_amount": "1.02",
        "mode": "banktransfer"
      }
    }
  }
}
```
Status Code 500 (Internal Server Error)
```
{
  "success": false,
  "message": "Transaction creation unsuccessful"
}
```

##### Get Transactions
* Endpoint: /transactions
* Method: GET
* Description: Allows a logged-in user to get their transactions
* No Request body
* Response:
Status Code 200 (OK): Returns an object with an array of transactions
```
{
  "success": true,
  "message": [
    {
      "_id": "6561f468dcee5a8e610e6c7d",
      "user_id": "6561d97b22dff78e8ddfb841",
      "tx_ref": "TXN-GN52eMtG",
      "payment_gateway": "Flutterwave",
      "payment_method": "Bank Transfer",
      "currency": "NGN",
      "amount": 1,
      "status": "pending",
      "createdAt": "2023-11-25T13:19:36.201Z",
      "updatedAt": "2023-11-25T13:19:36.201Z"
    },
    {
      "_id": "6561f551ab935ff803413008",
      "user_id": "6561d97b22dff78e8ddfb841",
      "tx_ref": "TXN-qkRUTw5F",
      "payment_gateway": "Flutterwave",
      "payment_method": "Bank Transfer",
      "currency": "NGN",
      "amount": 1,
      "status": "pending",
      "createdAt": "2023-11-25T13:23:29.187Z",
      "updatedAt": "2023-11-25T13:23:29.187Z"
    }
  ]
}
```

Status Code: 404 (Not Found)
```
{
  "success": false,
  "message": "No transactions found"
}
```

##### Get Transaction by Transaction Reference (tx_ref)
* Endpoint: /transactions/:tx_ref
    e.g /transactions/TXN-BmNPUl34
* Method: GET
* Description: Allows a logged-in user to get a transaction by tx_ref
* Parameters:
    Path parmater: :tx_ref
* Response
Status Code 200 (OK)
```
{
  "success": true,
  "message": {
    "_id": "6561f9b86b322db38f9f2f2e",
    "user_id": "6561d97b22dff78e8ddfb841",
    "tx_ref": "TXN-BmNPUl34",
    "payment_gateway": "Flutterwave",
    "payment_method": "Bank Transfer",
    "currency": "NGN",
    "amount": 1,
    "status": "pending",
    "createdAt": "2023-11-25T13:42:16.598Z",
    "updatedAt": "2023-11-25T13:42:16.598Z"
  }
}
```
Status Code 403 (Forbidden): if the user is not the creator of the transaction
```
{
  "success": false,
  "message": "You are not permitted to access this resource"
}
```
Status Code 404 (Not Found)
```
{
  "success": false,
  "message": "Transaction not found"
}
```

##### Search Transactions
* Endpoint: /transactions/search
* Method: POST
* Description: Allows a logged-in user to search transactions (by status e.g pending, successful, failed)
* Parameters:
 Request body: a JSON object with the keys status (mandatory), page, limit (page and limit are for pagination and are optional. If not set, page default is 1 and limit default is 5).
* Example of request body:
```
{
  "status": "pending",
  "limit": 2,
  "page": 1
}
```
* Response:
Status Code 200 (OK) (returns an object with the message being an object that contains the transactions as an array, and the pagination details as an object)
```
{
  "success": true,
  "message": {
    "transactions": [
      {
        "_id": "6561f9b86b322db38f9f2f2e",
        "user_id": "6561d97b22dff78e8ddfb841",
        "tx_ref": "TXN-BmNPUl34",
        "payment_gateway": "Flutterwave",
        "payment_method": "Bank Transfer",
        "currency": "NGN",
        "amount": 1,
        "status": "pending",
        "createdAt": "2023-11-25T13:42:16.598Z",
        "updatedAt": "2023-11-25T13:42:16.598Z",
        "__v": 0
      },
      {
        "_id": "6561f551ab935ff803413008",
        "user_id": "6561d97b22dff78e8ddfb841",
        "tx_ref": "TXN-qkRUTw5F",
        "payment_gateway": "Flutterwave",
        "payment_method": "Bank Transfer",
        "currency": "NGN",
        "amount": 1,
        "status": "pending",
        "createdAt": "2023-11-25T13:23:29.187Z",
        "updatedAt": "2023-11-25T13:23:29.187Z",
        "__v": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 2,
      "totalPages": 2,
      "totalCount": 3
    }
  }
}
```
Status Code 400 (Bad Request): if no status is provided in request body
```
{
  "success": false,
  "message": "Please provide status"
}
```
Status Code 404 (Not Found): if no transaction is found
```
{
  "success": false,
  "message": "No transactions found"
}
```
