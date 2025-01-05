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
  
## Task 4 Frontend application setup

- In the webapp directory, we would set up a simple react app using `npx create-react-app`
- we would basic pages like home, services to consume our backend API

## Task 5 Continous Integration work flow

- We would write a github workflow for both the backend and frontend to do the followings:

1. Install dependencies
2. Run tests
3. Builds application

To accomplish this task, we would first need to setup a  `.github/workflows/<filename>.yaml` in the project root directory

- install.yaml file

  ```yaml
  name: Install Dependencies

  on:
  push:
    branches:
      - main
      - feature/*
  pull_request:
    branches:
      - main

  jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install backend dependencies
        working-directory: ./api
        run: npm ci

      - name: Install frontend dependencies
        working-directory: ./webapp
        run: npm ci

  ```

- build.yaml file

  ```yaml
  name: Build

  on:
  workflow_run:
    workflows: ["Install Dependencies"]
    types:
      - completed

  jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build backend
        working-directory: ./api
        run: npm run build

      - name: Build frontend
        working-directory: ./webapp
        run: |
          npm ci
          npm run build

  ```

- test.yaml file

```yaml
name: Run Tests updated

on:
  workflow_run:
    workflows: ["Build"]
    types:
      - completed

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install backend dependencies
        working-directory: ./api
        run: npm ci

      - name: Run backend tests
        working-directory: ./api
        run: npm test

      - name: Install frontend dependencies
        working-directory: ./webapp
        run: npm ci

      - name: Run frontend tests
        working-directory: ./webapp
        run: npm test

```

## Task 6 Continous Integration work flow
We would now add a Dockerfile to our project
