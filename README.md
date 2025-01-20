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

- Frontend Dockerfile

```DSL
FROM node:20-alpine
WORKDIR /usr/src/app
COPY webapp/package*.json ./
RUN npm ci
COPY webapp/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

```

- backend Dockerfile

```DSL
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "start"]


```

```yaml
name: Dockerize and Push to Docker Hub

on:
  workflow_run:
    workflows: ["Build"]
    types:
      - completed

jobs:
  dockerize:
    runs-on: ubuntu-22.04

    steps:
      # Step 1: Checkout the code
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up Docker Buildx
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      # Step 3: Log in to Docker Hub
      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # Step 4: Build and push frontend image
      - name: Build and push frontend image
        run: |
          docker build --no-cache  -t ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:$GITHUB_SHA -f webapp/Dockerfile ./webapp
          docker push ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:$GITHUB_SHA

      # Step 5: Build and push backend image
      - name: Build and push backend image
        run: |
          docker build --no-cache  -t ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:$GITHUB_SHA -f api/Dockerfile ./api
          docker push ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:$GITHUB_SHA

```

## Task 7 Deploy to Cloud(AWS)

- We would include a deployment job for our pipeline as follows:

```yaml
deploy:
    name: Deploy to AWS EC2
    runs-on: ubuntu-22.04
    needs: dockerize
    steps:
      - name: Configure SSH for EC2
        run: |
          echo "${{ secrets.SSH_KEY }}" > ec2_key.pem
          chmod 600 ec2_key.pem

      - name: Deploy Dockerized App to EC2
        run: |
          ssh -o StrictHostKeyChecking=no -i ec2_key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_PUBLIC_IP }} << 'EOF'

          # Update system packages
          sudo apt-get update -y

          # Install Docker if not installed
          if ! [ -x "$(command -v docker)" ]; then
            sudo apt-get install -y docker.io
          fi

          # Ensure the user has Docker permissions
          sudo usermod -aG docker $USER || true
          newgrp docker || true

          # Log in to Docker Hub
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

          # Pull and run the backend container
          sudo docker pull ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:${{ github.sha }}
          sudo docker stop e-commerce-backend || true
          sudo docker rm e-commerce-backend || true
          sudo docker run -d --name e-commerce-backend -p 5000:5000 ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:${{ github.sha }}

          # Pull and run the frontend container
          sudo docker pull ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:${{ github.sha }}
          sudo docker stop e-commerce-frontend || true
          sudo docker rm e-commerce-frontend || true
          sudo docker run -d --name e-commerce-frontend -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:${{ github.sha }}

          EOF

```

## Task 8 Continous Deployment

- The pipline created above will ensure that whenever there is a change in our code, the workflow runs and deploys to our server

## Performance and security

- To improve this workflow for performance, you can leverage caching for dependencies, Docker layers, and test results. Caching reduces redundant work and improves execution times, especially in CI pipelines. Here's the enhanced workflow:
```yaml
name: CI Pipeline

on:
  push:
    branches:
      - feature/*

jobs:
  install:
    name: Install Dependencies
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Cache backend dependencies
        uses: actions/cache@v3
        with:
          path: ./api/node_modules
          key: backend-dependencies-${{ runner.os }}-${{ hashFiles('./api/package-lock.json') }}
          restore-keys: |
            backend-dependencies-${{ runner.os }}-

      - name: Install backend dependencies
        working-directory: ./api
        run: npm ci

      - name: Cache frontend dependencies
        uses: actions/cache@v3
        with:
          path: ./webapp/node_modules
          key: frontend-dependencies-${{ runner.os }}-${{ hashFiles('./webapp/package-lock.json') }}
          restore-keys: |
            frontend-dependencies-${{ runner.os }}-

      - name: Install frontend dependencies
        working-directory: ./webapp
        run: npm ci

  test:
    name: Run Tests
    runs-on: ubuntu-22.04
    needs: install
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run backend tests
        working-directory: ./api
        run: |
          npm test

      - name: Run frontend tests
        working-directory: ./webapp
        run: |
          npm test

  build:
    name: Build Application
    runs-on: ubuntu-22.04
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build backend
        working-directory: ./api
        run: npm run build

      - name: Build frontend
        working-directory: ./webapp
        run: npm run build

  dockerize:
    name: Dockerize Application
    runs-on: ubuntu-22.04
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: docker-cache-${{ runner.os }}-${{ github.sha }}
          restore-keys: |
            docker-cache-${{ runner.os }}-

      - name: Build and push frontend image
        run: |
          docker buildx build --cache-from=type=local,src=/tmp/.buildx-cache \
                             --cache-to=type=local,dest=/tmp/.buildx-cache \
                             -t ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:${{ github.sha }} \
                             -f webapp/Dockerfile ./webapp \
                             --push

      - name: Build and push backend image
        run: |
          docker buildx build --cache-from=type=local,src=/tmp/.buildx-cache \
                             --cache-to=type=local,dest=/tmp/.buildx-cache \
                             -t ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:${{ github.sha }} \
                             -f api/Dockerfile ./api \
                             --push

  deploy:
    name: Deploy to AWS EC2
    runs-on: ubuntu-22.04
    needs: dockerize
    steps:
      - name: Configure SSH for EC2
        run: |
          echo "${{ secrets.SSH_KEY }}" > ec2_key.pem
          chmod 600 ec2_key.pem

      - name: Deploy Dockerized App to EC2
        run: |
          ssh -o StrictHostKeyChecking=no -i ec2_key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_PUBLIC_IP }} << 'EOF'

          # Update system packages
          sudo apt-get update -y

          # Install Docker if not installed
          if ! [ -x "$(command -v docker)" ]; then
            sudo apt-get install -y docker.io
          fi

          # Ensure the user has Docker permissions
          sudo usermod -aG docker $USER || true
          newgrp docker || true

          # Log in to Docker Hub
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

          # Pull and run the backend container
          sudo docker pull ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:${{ github.sha }}
          sudo docker stop e-commerce-backend || true
          sudo docker rm e-commerce-backend || true
          sudo docker run -d --name e-commerce-backend -p 5000:5000 ${{ secrets.DOCKER_USERNAME }}/ecommercebackend:${{ github.sha }}

          # Pull and run the frontend container
          sudo docker pull ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:${{ github.sha }}
          sudo docker stop e-commerce-frontend || true
          sudo docker rm e-commerce-frontend || true
          sudo docker run -d --name e-commerce-frontend -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/ecommercefrontend:${{ github.sha }}

          EOF

```
