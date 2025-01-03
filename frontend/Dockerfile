# Build the React app
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the app and inject runtime variables
FROM nginx:1.21-alpine

# Set the working directory for Nginx
WORKDIR /usr/share/nginx/html

# Copy the build output from the builder stage
COPY --from=builder /app/build .

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port for the app
EXPOSE 80

# Start Nginx with environment variable substitution
CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

################
# OLDER VERSION
################

# # Use a Node.js image for building
# FROM node:18-alpine as builder

# # Set the working directory
# WORKDIR /app

# # Copy the package.json and package-lock.json files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all application files
# COPY . .

# # Build the React app
# RUN npm run build

# # Use a lightweight server image for serving static files
# FROM node:18-alpine

# # Install `serve` globally
# RUN npm install -g serve

# # Set the working directory
# WORKDIR /app

# # Copy the build output from the builder stage
# COPY --from=builder /app/build ./build

# # Expose the port
# EXPOSE 3000

# # Serve the build directory using `serve`
# CMD ["serve", "-s", "build", "-l", "3000"]
