FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/id-generator-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]