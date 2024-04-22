FROM node:18

# Install Python and Pip3
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN npm install -g pnpm && pnpm install

# Copy the Next.js app directory
COPY app ./app

# Copy requirements.txt from the root directory
COPY requirements.txt .

# Create a virtual environment in the root directory
RUN python3 -m venv /venv

# Activate the virtual environment
ENV PATH="/venv/bin:$PATH"

# Install Flask dependencies in the virtual environment
RUN pip install -r requirements.txt

# Copy .env.local file
COPY .env.local .

# Expose ports used by Next.js and Flask
EXPOSE 3000 5328

# Set environment variables for connecting using maps API and TiDB
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyBYyZWGZ1jBc7mc3lbKoCMFlnLMkiim4UA"
ENV NEXT_PUBLIC_MAPS_STYLE="974c2394503aa54b"
ENV TIDB_HOST="gateway01.us-west-2.prod.aws.tidbcloud.com"
ENV TIDB_PORT="4000"
ENV TIDB_USER="2YrnwR6sRgNbDA9.root"
ENV TIDB_PASSWORD="bfU9vy8zYqVU5srH"
ENV TIDB_DATABASE="prod"
ENV SSL_CA="/etc/ssl/certs/ca-certificates.crt"

CMD npm run dev