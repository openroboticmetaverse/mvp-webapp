# Use the official Node.js image from the Docker Hub
FROM node:lts

# Set the working directory in the container
WORKDIR /var/www/html/app/

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application in development mode
CMD ["npm", "run", "dev"]
