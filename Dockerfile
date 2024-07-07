# Use an updated Node.js version that satisfies the dependencies
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock first to take advantage of Docker's layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "dev"]