FROM golang:1.23-alpine

# Attempt 1 for Render
ENV MONGO_ATLAS_USERNAME=${MONGO_ATLAS_USERNAME}
ENV MONGO_ATLAS_PASSWORD=${MONGO_ATLAS_PASSWORD}
ENV MONGO_URI=${MONGO_URI}
ENV MONGO_DB_NAME=${MONGO_DB_NAME}
ENV MONGO_COLLECTION=${MONGO_COLLECTION}

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN go build -o main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]