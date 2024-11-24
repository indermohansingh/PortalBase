# Use the official OPA image as the base image
FROM openpolicyagent/opa:latest-static

# Set the working directory inside the container
WORKDIR /app

# Copy the policy files into the container (adjust the source path as necessary)
COPY ./policies /app/policies

# Expose the port that OPA will listen on (default 8181)
EXPOSE 8181

# Set the default command to run OPA with your policy files
CMD ["run", "--server", "--log-level", "debug", "--set", "decision_logs.console=true", "/app/policies"]
