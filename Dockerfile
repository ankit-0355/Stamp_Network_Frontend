# Stage 1: Build the Angular application
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular application for production
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's web root
# Note: Angular 17+ outputs build files into dist/<project-name>/browser
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
