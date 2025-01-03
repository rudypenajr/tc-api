# NGINX
# Build Stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Serve Static Files
FROM nginx:1.21-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Add Nginx Configuration for Runtime Variables
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


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
