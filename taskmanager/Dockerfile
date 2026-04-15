# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build project
RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests

# Run application
CMD ["java", "-jar", "target/*.jar"]