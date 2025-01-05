# Use the official Node.js image from Docker Hub 
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Expose the backend port (e.g., 3000)
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
