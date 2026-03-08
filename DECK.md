---
Title: E-Commerce
Description: plans and project management sheets
Date: 
Robots: noindex,nofollow
Template: index
---

# E-Commerce

## Analyzing all parts

|#|Part|Details|Total Duration|Status|
|:-|:-|:-|:-|:-|
|1|-|-|-|-|-|
|:-|:-|:-|::||


## Timeplan

```mermaid
gantt
    section ecommerce
```

# 1 - ecommerce

## 001-0001
> **Init repo.** ![status](https://img.shields.io/badge/status-DONE-brightgreen)
> <details >
>     <summary>Details</summary>
> The goal of this card is to initialize the repo.
> 
> # DOD (definition of done):
> A new maven project is setup.
> 
> # TODO:
> - [x] 1. Add DECK and a board
> - [x] 2. Create an empty maven project
> - [x] 3. Add dependencies to the project
> - [x] 4. Add a simple service
> - [x] 5. Add a simple client
> - [x] 6. Add a simple test
> 
> # Reports:
> * Create an empty project
> >```
> >docker exec -it maven mvn archetype:generate \
> >    -DarchetypeArtifactId=maven-archetype-quickstart \
> >    -DgroupId=com.ecommerce \
> >    -DartifactId=ecommerce \
> >    -DinteractiveMode=false \
> >    -DoutputDirectory=E-commerce-Platform-workshop
> >```
> * Create database (from inside of containers for example from `cli`):
> >```
> >mysql -u root -pmypass -h 172.32.0.16 < add-ecommerce.sql
> >```
> * test :
> >```
> >mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
> >
> >mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
> >```
> * Access
> >```
> >http://localhost:3280/sites/spring/index.html
> >```
> * Run tests
> >```
> >mvn test -Dspring.profiles.active=dev
> >mvn test -Dspring.profiles.active=dev,test
> >
> >mvn test -Dtest=ECommerceAppTest#testECommerceApp
> >
> >```
> </details>
