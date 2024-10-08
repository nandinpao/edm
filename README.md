# Email Marketing Solution(Electronic Direct Mail)
Email Marketing Solution. No more relying on third-party platforms! Build your own EDM platform to
        take control of your email marketing, freely manage SMTP, perform
        real-time data analysis, and ensure high security. Improve marketing
        efficiency and reliability.

# Service System Installation Guide

## Prerequisites

Before starting, make sure **Docker** is installed and running on your system. The components mentioned below will be deployed as Docker containers.

## Step 1: Install Core Services

Navigate to the `install/server` directory and install the following services. The system will automatically detect your local machine's IP address. If these services are already running on your machine, make sure to configure them properly.

- **Redis 3+**
- **Consul 1.15.4**
- **MySQL 8.4.2**
- **Apache Artemis 2.36.0**

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
   ```
4. After the services are successfully started, access the application by visiting
```bash
http://{ip}:8090
```
Replace {ip} with your machine's IP address.

#Configuration
