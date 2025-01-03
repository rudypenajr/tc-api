# Build Stage
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Serve Static Files
FROM nginx:1.21-alpine

# Install gettext to use envsubst
RUN apk --no-cache add gettext

# Copy the build output from the builder stage to the NGINX HTML directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the NGINX configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Use envsubst to replace variables in the NGINX configuration file at runtime
CMD envsubst '$REACT_APP_API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

# Expose port 80
EXPOSE 80



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

# # Set environment variable for build
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# RUN echo "API version: $REACT_APP_API_URL"

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

# # Set environment variable for build
# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=${REACT_APP_API_URL}


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
