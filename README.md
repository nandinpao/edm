# edm
Electronic Direct Mail


Installation Guide for Service System
Prerequisites
Before you proceed with the installation, ensure that Docker is installed and running on your system. The following components will be deployed as Docker containers.

Step 1: Install Core Services
First, install the services located in the install/server directory. These core services include Redis, Consul, and MySQL. By default, the system will automatically retrieve the local machine's IP address.

If you already have these services running, ensure that the following configurations are correctly set for each component:

Redis
Consul
MySQL
Step 2: Install the Service Components
Open the docker-compose.yml file and configure the IP addresses, usernames, and passwords for Redis, MySQL, and Consul.

After making the necessary changes, execute the ./start.sh script.

Once the services have successfully started, you can access the system via the following URL:

arduino
複製程式碼
http://{ip}:8090
Replace {ip} with your machine's IP address.
