# 🔐 Spring Security Hub - JWT & OAuth2 Google

<div align="center">
<img src="https://img.shields.io/badge/Spring_Boot-4.0.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT">
</div>

## 📌 Sobre o Projeto
Este é um ecossistema de segurança avançado desenvolvido com as versões mais recentes do Spring Boot (4.0.2) e Java 21. O projeto implementa uma solução de identidade híbrida, permitindo que os utilizadores se autentiquem via credenciais tradicionais (E-mail/Senha) ou através do Login Social com Google (OAuth2/OIDC).

A arquitetura é totalmente Stateless, utilizando tokens JWT assinados com chaves RSA (Pública/Privada) para garantir a integridade e escalabilidade da API.

> :construction: Projeto em construção :construction:
<p align="center"><img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/></p>

## 🚀 Funcionalidades Implementadas
**Login Híbrido**: Integração completa com Google OAuth2 e autenticação local com BCrypt. 

**Auto-Provisionamento**: Criação automática de perfil de utilizador e vinculação de permissões após o login social.

**Segurança com Spring Security 7**: Uso extensivo de Lambda DSLs para configurações de filtros e autorização.

**RBAC (Role-Based Access Control)**: Hierarquia de permissões (ADMIN vs BASIC) protegendo endpoints específicos.

**Observabilidade**: Sistema de logs detalhados (SLF4J) para monitorização do fluxo de autenticação.

**Persistência Segura**: Gestão de base de dados MySQL integrada via Spring Data JPA.

**Sistema de Micro-blogging (Tweets)**: Criação e visualização de conteúdo em tempo real integrado ao sistema de permissões.

## 🏗️ Arquitetura de Autenticação
## 🛠️ Stack Tecnológica

Linguagem: Java 21 (LTS)

Framework: Spring Boot 4.0.2 / Spring Security 7

Token: Nimbus JOSE + JWT (Assinatura RSA 256)

Base de Dados: MySQL 8.0

Segurança de Password: BCryptPasswordEncoder

Ferramentas: Docker, Maven, Google Cloud Console

## 🏗️ Arquitetura de Segurança
O fluxo de segurança foi desenhado para ser resiliente:

OAuth2SuccessHandler: Intercepta o sucesso do Google, persiste o utilizador e gera o redirecionamento com o JWT.

RSA Keys: Utilização de par de chaves assimétricas para assinatura de tokens.

CORS: Configurado para permitir integrações seguras com frontends modernos (React/Next.js).

## 📋 Endpoints Principais

| Método | Endpoint                             | Descrição                                   | Acesso            |
|--------|--------------------------------------|---------------------------------------------|-------------------|
| POST   | /login                               | Autenticação local (retorna JWT)            | Público           |
| GET    | /oauth2/authorization/google         | Inicia o fluxo de login com Google          | Público           |
| POST   | /users                               | Registo de novos utilizadores               | Público           |
| PUT    | /users/{id}                          | Atualização de nome e foto de user          | Autenticado       |
| GET    | /feed                                | Visualização de tweets                      | Público           |
| POST   | /tweets                              | Criação de novo tweet                       | Autenticado       |
| DELETE | /tweets/{id}                         | Excruir tweet                               | Autenticado/Admin |


## ⚙️ Configuração do Ambiente
Para manter a segurança, o projeto utiliza Variáveis de Ambiente.

1. Crie um ficheiro .env na raiz do projeto:
```bash
GOOGLE_CLIENT_ID=seu_id_aqui
GOOGLE_CLIENT_SECRET=seu_secret_aqui
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

2. Certifique-se de ter as chaves ```bash app.pub``` e ```bash app.key``` na pasta ```bashsrc/main/resources```.

## License

[MIT](https://choosealicense.com/licenses/mit/)
