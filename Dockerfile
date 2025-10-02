# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the production-ready static files
RUN npm run build


# --- Stage 2: Serve the App with NGINX ---
FROM nginx:stable-alpine

# Copy the built files from the 'builder' stage into the NGINX server directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Tell Docker that the container listens on port 80
EXPOSE 80

# The command to start the NGINX server
CMD ["nginx", "-g", "daemon off;"]