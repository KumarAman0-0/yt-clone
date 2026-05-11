# --- Step 1: Frontend Build ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Step 2: Backend & Runtime ---
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies (for yt-dlp to handle audio conversion if needed)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the rest of the backend and the built frontend
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set working directory to backend to run the server
WORKDIR /app/backend

# Expose the port (Render/Koyeb will assign this via environment variable)
EXPOSE 5000

# Command to run the server
CMD ["python", "server.py"]
