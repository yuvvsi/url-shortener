# Stage 1: Build the project
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy all files (including Maven wrapper)
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the project (jar created in target/)
RUN ./mvnw clean package -DskipTests

# Stage 2: Create minimal runtime image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/urlsh-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
