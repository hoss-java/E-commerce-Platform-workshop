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

## 001-0002
> **Add entities.** ![status](https://img.shields.io/badge/status-ONGOING-yellow)
> <details open>
>     <summary>Details</summary>
> The goal of this card is to add entities for `Address`, `UserProfile` and `Customer`.
> 
> # DOD (definition of done):
> Entities are added.
> 
> # TODO:
> - [x] 1. Add `Address` and its tests
> - [x] 2. Add `UserProfile` and its tests
> - [x] 3. Add `Customer` and its tests
> - [ ] 4. Add queries
> 
> # Reports:
> ## `Address`
> * An entity, a repository ,a service and a controller for Address was added.
> * Test for Addresscontroller was added
> ## `UserProfile`
> * An entity, a repository ,a service and a controller for UserProfile was added.
> * Test for UserProfilecontroller was added
> ## `Customer`
> * An entity, a repository ,a service and a controller for Customer was added.
> * Test for Customercontroller was added
> 
> 
> ## Services' path
> | Controller | Method | Endpoint | Description |
> |---|---|---|---|
> | **CustomerController** | GET | `/api/customers` | Get all customers |
> | | POST | `/api/customers` | Create a new customer |
> | | GET | `/api/customers/{id}` | Get customer by ID |
> | | PUT | `/api/customers/{id}` | Update customer |
> | | DELETE | `/api/customers/{id}` | Delete customer |
> | | GET | `/api/customers/email/{email}` | Find by email |
> | | GET | `/api/customers/last-name/{lastName}` | Find by last name |
> | | GET | `/api/customers/city/{city}` | Find by city |
> | | GET | `/api/customers/search/email?keyword=...` | Search email by keyword |
> | | GET | `/api/customers/created-after?date=...` | Find created after date |
> | | GET | `/api/customers/created-between?startDate=...&endDate=...` | Find created between dates |
> | | GET | `/api/customers/count/city/{city}` | Count customers by city |
> | | GET | `/api/customers/exists/{email}` | Check if customer exists by email |
> | **UserProfileController** | GET | `/api/user-profiles` | Get all user profiles |
> | | POST | `/api/user-profiles` | Create a new user profile |
> | | GET | `/api/user-profiles/{id}` | Get user profile by ID |
> | | PUT | `/api/user-profiles/{id}` | Update user profile |
> | | DELETE | `/api/user-profiles/{id}` | Delete user profile |
> | | GET | `/api/user-profiles/nickname/{nickname}` | Find by nickname |
> | | GET | `/api/user-profiles/search/phone?phonePartial=...` | Search by partial phone number |
> | | GET | `/api/user-profiles/with-bio` | Find profiles with bio |
> | | GET | `/api/user-profiles/nickname-prefix/{prefix}` | Find by nickname prefix |
> | | GET | `/api/user-profiles/count/phone-prefix/{prefix}` | Count by phone number prefix |
> | **AddressController** | GET | `/api/addresses` | Get all addresses |
> | | POST | `/api/addresses` | Create a new address |
> | | GET | `/api/addresses/{id}` | Get address by ID |
> | | PUT | `/api/addresses/{id}` | Update address |
> | | DELETE | `/api/addresses/{id}` | Delete address |
> | | GET | `/api/addresses/zip-code/{zipCode}` | Find by zip code |
> | | GET | `/api/addresses/city/{city}` | Find by city |
> | | GET | `/api/addresses/street/{street}` | Find by street name |
> | | GET | `/api/addresses/count/zip-code/{zipCode}` | Count by zip code |
> | | GET | `/api/addresses/zip-code-prefix/{prefix}` | Find by zip code prefix |
> </details>
