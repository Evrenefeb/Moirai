# Use an official Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on (usually 5173 for Vite, 3000 for CRA)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]