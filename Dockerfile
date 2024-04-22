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

CMD npm run dev