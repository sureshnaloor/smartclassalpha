#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the script directory
cd "$SCRIPT_DIR"

# Create logs directory if it doesn't exist
mkdir -p logs

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Run the Node.js script and log the output
node update-rds-security.js >> "logs/rds-security-update_${TIMESTAMP}.log" 2>&1

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "RDS security group update completed successfully at $(date)" >> "logs/rds-security-update_${TIMESTAMP}.log"
else
    echo "RDS security group update failed at $(date)" >> "logs/rds-security-update_${TIMESTAMP}.log"
fi 