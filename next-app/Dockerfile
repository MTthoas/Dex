# Use an official Node.js image as the base image
FROM node:20-alpine

# Install Python and other dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /next-app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
