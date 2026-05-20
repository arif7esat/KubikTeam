FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY smartcart-backend/pom.xml smartcart-backend/mvnw smartcart-backend/.mvn ./
COPY smartcart-backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY smartcart-backend/src ./src
COPY trendyol_verileri_guncel/trendyol_verileri /app/data/trendyol_verileri
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/data/trendyol_verileri ./data/trendyol_verileri
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
