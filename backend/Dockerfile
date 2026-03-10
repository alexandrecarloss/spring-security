# Estágio 1: Build (Compilação)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copia apenas o pom.xml e baixa as dependências (otimiza o cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e gera o JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Runtime (Execução)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copia o JAR gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]