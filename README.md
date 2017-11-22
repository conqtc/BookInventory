# BookInventory
Demonstration of SOAP web services with BPEL using WSO2 technology

## Requirements
The book ordering process requires information about the student who made the request and the book to be ordered. 

Student details will be validated against the information stored in the student database via [student service].

The requested book is validated against the internal book database using [book inventory service] to ensure that the book has not already been registered in the database. 
Book's details will be gathered using [book information service] (this service queries Google Books APIs to retrieve book's details). Only books are available in Australia and has average rating >= 3 are accepted.

Valid book order will be recorded to database (MySQL) via [book inventory service].

## Modules

### Book ordering process (BPEL)
This module uses BPEL to control the process execution between services.

### Book inventory service (SOAP)
The book inventory service is used to query and insert record to local MySQL database.

### Student service (SOAP)
The student service is used to retrieve details of each student, this includes student ID, PIN and full name.

### Book information service (SOAP)
The book information service is used to query Google Books APIs to get detail information about books, such as author, publish date and title.		

### Booking Application
A web client using jQuery/Ajax to communicate with the services

## Book ordering request/response
The book ordering request contains the following information:
* Student ID of the student who made the request
* PIN number of the student
* ISBN of the requested book in either 10 or 13‐digit format

A successful book ordering response contains at least the following information:
* Status of the order 
* Book title
* Book authors
* Publisher

An unsuccessful book ordering response contains at least the following information: 
* Status of the order
* Appropriate statement indicating why the request was not successful

## Student information validation
The student database stores following information:
* Student ID in numeric format 
* Full name
* 4‐digit secret PIN number

## Book database validation
The requested ISBN is validated:
* Given ISBN is NOT already in the database

The book database stores following information:
* Book ID,
* Book title,
* List of authors
* ISBN in either 10‐digit or 13‐digit format
* Publisher
* Published date
* Status of the book which is either “available”, “on loan” or “in order”

## Book details retrieval
The given ISBN will be queried to retrieve following information:
* If this ISBN is valid
* Book title
* List of authors
* ISBN in both 10‐digit and 13‐digit format 
* Publisher
* Published date
* Average rating
* Availability of the book in Australian market
