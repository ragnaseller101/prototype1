# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Set environment variables if needed (uncomment and add as required)
# ENV ENV_VARIABLE=value
ENV token=MTAwNjkxODU5ODE4ODYxNzgwOQ.G8j1JR.qJLZcZwa4TOl_Jj_cP05YvfgfRg50MVYdXg1_c
ENV client_id=1006918598188617809
ENV home_server=982609493156319252
ENV log_channel=1010104351894806529
ENV db_url=mongodb+srv://valorant:valorant@celestial.wdyq0mp.mongodb.net/Prototype?retryWrites=true&w=majority

# Expose the port your bot is listening on
# Replace 3000 with your actual bot port
EXPOSE 3000

# Command to run your bot (adjust based on your start script)
CMD ["node", "index.js"]
