FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Fix line endings and set execute permissions
RUN sed -i 's/\r$//' mvnw && \
    chmod +x ./mvnw
RUN ./mvnw install -DskipTests

FROM eclipse-temurin:17-jre-alpine
# Install curl for health checks
RUN apk add --no-cache curl

VOLUME /tmp
COPY --from=build /workspace/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
