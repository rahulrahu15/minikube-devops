# Use lightweight Nginx image
FROM nginx:alpine

# Remove default Nginx HTML
RUN rm /usr/share/nginx/html/*

# Copy frontend files
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
