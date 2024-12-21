# E-Commerce-Platform

The project involves developing and maintaining an e-commerce platform. This platform will have two primary components: E-Commerce API:: Backend service handling product listings, user accounts, and order processing.  E-Commerce Frontend: : A web application for users to browse products, manage their accounts, and place orders.

The goal is to automate the integration and deployment process for both components using GitHub Actions, ensuring continuous delivery and integration.

## Task 1

- Project Setup:
  - Create a new GitHub repository named `ecommerce-platform`
  
  1. To achieve task you will need to sign into you github repositroy
  ![Sign into github repository](/github-repo.png)
  2. Create the repo and name it `ecommerce-platform`

## Task 2

- Initialize a Git repository

1. Initialize a Git repository and add your initial project structure.
2. Create `.github/workflows/` in the repository for github actions

## Task 3

- Api setup
To setup our simple nodejs express api we would carryout the folowing:

1. Create an api folder in the root of our project
2. Inside the api directory, we would initiate a package.json using `npm init -y`
3. Still in the api directory, we would install our depndencies using:
   `npm i express jest nodemon supertest`
   - express: to spin up our server
   - jest: a javascript library to run our test
   - supertest: to initiate our http request during server test
   - nodemon: to automatially keep our server running
