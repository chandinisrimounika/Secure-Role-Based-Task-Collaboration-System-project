# Use Java 17
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests

# Run the app
CMD ["java", "-jar", "target/*.jar"]