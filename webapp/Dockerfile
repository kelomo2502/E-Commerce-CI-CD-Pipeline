# Use the official Node.js image from Docker Hub
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./webapp/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY ./webapp/ .

# Build the React app
RUN npm run build

# Expose the frontend port (e.g., 3000)
EXPOSE 3000

# Command to serve the built React app
CMD ["npm", "start"]
