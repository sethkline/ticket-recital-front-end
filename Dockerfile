# Use a specific version of node that is compatible with your project
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your project files
COPY . .

# Build your Nuxt project
RUN yarn build

# Expose the port Nuxt runs on
EXPOSE 3000

# Command to run your app
CMD ["yarn", "start"]
