# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container, excluding files in .dockerignore
COPY . .

# Expose the port the app runs on (change 3000 to your app's actual port if needed)
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Command to run your app
CMD ["node", "server.js"]
