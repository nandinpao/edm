# edm
Electronic Direct Mail

# Service System Installation Guide

## Prerequisites

Before starting, make sure **Docker** is installed and running on your system. The components mentioned below will be deployed as Docker containers.

## Step 1: Install Core Services

Navigate to the `install/server` directory and install the following services. The system will automatically detect your local machine's IP address. If these services are already running on your machine, make sure to configure them properly.

- **Redis**
- **Consul**
- **MySQL**

> **Note:** If you already have these services installed, configure the respective service settings as described in Step 2.

## Step 2: Install Service Components

1. Open the `docker-compose.yml` file.
2. Configure the IP addresses, usernames, and passwords for:
   - **Redis**
   - **MySQL**
   - **Consul**
3. Once the configurations are set, run the following command to start the services:
   ```bash
   ./start.sh

```bash
http://{ip}:8090
```

Replace {ip} with your machine's IP address.
