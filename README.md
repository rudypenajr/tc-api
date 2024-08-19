# tc-api

#### Docker Compose

- It defines four services:
  - Web (for Nginx)
  - API (for Golang)
  - DB (for MongoDB)
  - Frontend (for React).
- It specifies the build context for the API (backend) and frontend services, which tells Docker Compose where to find their Dockerfiles.
- It exposes port 80 on the web service to port 80 on the host machine.
- It exposes port 3000 on the frontend service to port 3000 on the host machine.
