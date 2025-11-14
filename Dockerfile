# Use lightweight Node.js
FROM node:18-alpine

# Working directory inside container
WORKDIR /app

# Copy only package.json first (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all other project files
COPY . .

# Environment variable for JWT secret
ENV JWT_SECRET="change_in_production"

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
