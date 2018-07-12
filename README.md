# Auth Backend Example
This repository contains an example backedn which will provide an authorization machanism for a REST API.
The repository [ng-auth-ngrx](https://github.com/d-koppenhagen/ng-auth-ngrx) contains an example application which will use this backend.


## Setup & Run
1) Install [Node.js with NPM](https://nodejs.org/) at your system.
2) Navigate via console into the root folder of this project and run thw following command to install dependent modules:
`npm install`
3) Copy the file `config.example.js` to `config.js` and adjust the port and database parameter. 
4) Run the server: `npm start`

# Hints
This backend is used as a blueprint and it is designed as follows:

1.) The client app should send the following JSON object for authentication purpose first to the backend:
```
curl 'http://localhost:8080/login' -H 'Content-Type: application/json' --data-binary '{"email":"user@example.com" "password":"1a79a4d60de6718e8e5b326e338ae533"}'
```
Please keep in mind that the password should not be sent in plaintext. (I use md5 instead).
In that case it is the md5 from `example`.

2.) The backend will respond with an object like that:
```json
{
    "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzE5ODg1MzAyMTZ9.ROUfgwt5GGdH4unEw9prX1DC8rzkkHQ3oQtOItdST0w",
    "expires":1531988530216,
    "user":{
        "email":"user@example.com",
        "password":"1a79a4d60de6718e8e5b326e338ae533"
    }
}
```
This response can be stored e.g. in the browsers local storage and should be used for further user requests.
The value `expires` tells the client how long the current token is valid and the client should be logged out if the expiration is before the current date.

3.) The backends REST resources starting with `/api/v1/` are only accessable by using the received token and the current email for every request:
```
curl 'http://localhost:8080/api/v1/example' -H 'x-key: user@example.com' -H 'x-access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzE5OTA2NTk0MDF9.QvuJIHp2YqlUoN38jkbcz7JFPIiV2TLM3lCrp8PG07A'
```