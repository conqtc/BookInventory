/*
$(document).ready(function() {
    jQuery.support.cors = true;
});
*/

function isbnChanged() {
    isbn = $.trim($("#request_book_isbn").val());
    $("#check_isbn").attr("disabled", (isbn.length == 0));
} 

/**
 * 
 * @returns {undefined}
 */
function menuSelectionChanged() {
    div_selected = $('input[name=menu]:checked').val();
    $('div').each(function() {
        $(this).css('display', 'none');
    });
    
    if (div_selected == "div_student_request_server") {
        div_selected = "div_student_request"
    }
    
    $("#" + div_selected).css('display', 'block');
    $("#div_error").css('display', 'block');
    $("#div_result").css('display', 'block');
    clearError()
    clearResult()
}

/**
 * http://stackoverflow.com/questions/6507293/convert-xml-to-string-with-jquery
 * @param {type} xmlData
 * @returns {unresolved}
 */
function xmlToString(xmlData) { 
    var xmlString;
    
    if (window.ActiveXObject) { //IE
        xmlString = xmlData.xml;
    } else { // code for Mozilla, Firefox, Opera, etc.
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    
    return xmlString;
}

/**
 * 
 * @returns {undefined}
 */
function clearError() {
    $("#div_error").text("");
}

/**
 * 
 * @param {type} message
 * @returns {undefined}
 */
function displayError(message) {
    $("#div_error").text(message);
}

/**
 * 
 * @returns {undefined}
 */
function clearResult() {
    $("#div_result").text("");
}

/**
 * 
 * @param {type} message
 * @returns {undefined}
 */
function displayMessage(message) {
    $("#div_result").text(message);
}

/**
 * 
 * @returns {undefined}
 */
function execute() {
    // get selected menu
    div_selected = $('input[name=menu]:checked').val();
    switch (div_selected) {
        case "div_view_all_book":
            ajaxViewAllBooks();
            break;
        case "div_view_book":
            ajaxViewBook();
            break;
        case "div_add_book":
            ajaxAddBook();
            break;
        case "div_update_book":
            ajaxUpdateBook();
            break;
        case "div_student_borrow":
            ajaxBorrowBook();
            break;
        case "div_student_record":
            ajaxViewStudentRecord();
            break;
        case "div_soap_student_record":
            soapViewStudentRecord();
            break;
        case "div_student_request_server":
            soapBookRequest();
            break;
        case "div_student_request":
            handleBookRequest();
            break;
        case "div_google_book_search":
            ajaxGoogleBookSearch();
            break;
        default:
            displayError("Please select one of the menu items above.");
            break;
    }
}

/**
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewBorrowBookInfo(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();
    
    $error = $xml.find('error');
    if ($error.length > 0) {
        $("#borrow_book_info").html('<label style="color:red">Book not found!</label>');
    } else {
        $xml.find('book').each(function() {
            status = $(this).find('status').text();
            title = $(this).find('title').text();
            if (status > 0) {
                $("#borrow_book_info").html('<label style="color:red">The book "' + title + '" is ' + (status == 1 ? 'on loan':'in back order') + ' </label>');
            } else {
                $("#borrow_book_info").html('<label style="color:green">The book "' + title + '" is available </label>');
            }
        });
    }
}

/**
 * 
 * @returns {undefined}
 */
function checkBorrowBookId() {
    bookId = $.trim($("#borrow_book_id").val());
    if (bookId.length == 0) return;
    
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book/' + bookId,
        dataType: 'text',
        success: function(data) {
            viewBorrowBookInfo(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/*
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewUpdateBookInfo(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();
    
    $error = $xml.find('error');
    if ($error.length > 0) {
        $("#update_book_title").val("");
        $("#update_book_author").val("");
        $("#update_book_isbn").val("");
        $("#update_book_publisher").val("");
        $("#update_book_pdate").val("");
    } else {
        $xml.find('book').each(function() {
            $("#update_book_title").val($(this).find('title').text());
            $("#update_book_author").val($(this).find('author').text());
            $("#update_book_isbn").val($(this).find('isbn').text());
            $("#update_book_publisher").val($(this).find('publisher').text());
            $("#update_book_pdate").val($(this).find('pdate').text());
            status = $(this).find('status').text();
            $("#update_book_status").val(status);
        });
    }
}

/**
 * 
 * @returns {undefined}
 */
function checkUpdateBookId() {
    bookId = $.trim($("#update_book_id").val());
    if (bookId.length == 0) return;
    
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book/' + bookId,
        dataType: 'text',
        success: function(data) {
            viewUpdateBookInfo(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}


/**
 * 
 * @param {type} title
 * @param {type} author
 * @param {type} isbn
 * @param {type} publisher
 * @param {type} pdate
 * @returns {String}
 */
function formRequestBookXml(studentId, pin, isbn, gid, title, author, publisher, pdate) {
    return '<ns:requestBook xmlns:ns="http://waa.a1">' +
        "<ns:studentId>" + studentId + "</ns:studentId>" +
        "<ns:pin>" + pin + "</ns:pin>" +
        "<ns:isbn>" + isbn + "</ns:isbn>" +
        "<ns:gid>" + gid + "</ns:gid>" +
	"<ns:title>" + title + "</ns:title>" +
	"<ns:author>" + author + "</ns:author>" +	
	"<ns:publisher>" + publisher + "</ns:publisher>" +
	"<ns:pdate>" + pdate + "</ns:pdate>" +
        "</ns:requestBook>";
}


/**
 * 
 * @param {type} bookIsbn
 * @param {type} gid
 * @param {type} title
 * @param {type} authors
 * @param {type} isbn
 * @param {type} publisher
 * @param {type} pdate
 * @returns {undefined}
 */
function ajaxRequestNewBook(studentId, pin, isbn, gid, title, author, publisher, pdate) {
    xmlData = formRequestBookXml(studentId, pin, isbn, gid, title, author, publisher, pdate);
    
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/request',
        data: xmlData,
        contentType: 'application/xml',
        dataType: 'text',
        success: function(data) {
            viewResultMessage(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @returns {undefined}
 */
function handleBookRequest() {
    studentId = $.trim($("#request_student_id").val());
    pin = $.trim($("#request_student_pin").val());
    bookIsbn = $.trim($("#request_book_isbn").val());
    
    clearResult();
    
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + bookIsbn,
        success: function(data) {
            // parse to JSON
            data = $.parseJSON(data);
            
            totalItems = data.totalItems;
            if (totalItems != 1) {
                displayError("No book found with such id.");
            }
            else {
                $.each(data.items, function(index, book) {
                    googleId = book.id;

                    title = book.volumeInfo.title
                    if (book.volumeInfo.hasOwnProperty('subtitle')) {
                        title += ' ' + book.volumeInfo.subtitle;
                    }

                    authors = book.volumeInfo.authors;
                    publisher = book.volumeInfo.publisher;

                    pdate = '';
                    if (book.volumeInfo.hasOwnProperty('publishedDate')) {
                        pdate = book.volumeInfo.publishedDate;
                    }

                    isbn = '';
                    $.each(book.volumeInfo.industryIdentifiers, function(index, element) {
                        if (isbn.length == 0) { 
                            isbn = element.identifier 
                        } else {
                            isbn += ',' + element.identifier;
                        }
                    });

                    available = false;
                    if (book.saleInfo.country == 'AU') {
                        if (book.saleInfo.saleability == 'FOR_SALE') {
                            available = true;
                        }
                    }

                    rating = 0;
                    if (book.volumeInfo.hasOwnProperty('averageRating')) {
                        rating = book.volumeInfo.averageRating;
                    }
                });
                
                if (rating < 3) {
                    displayError("Rating is insufficient or N/A");
                } else if (!available) {
                    displayError("Book is not available in Autralia");
                } else {
                    ajaxRequestNewBook(studentId, pin, isbn, googleId, title, authors, publisher, pdate);
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            displayError(errorThrown);
        },
        async: false
    });
}


/**
 * 
 * @param {type} data
 * @returns {undefined}
 */
function displaySearchResult(data) {
    totalItems = data.totalItems;

    if (totalItems == 0) {  // no book found
        $("#book_search_result").text('No book found.');
    } else {
        body = '<tr>' + 
                '<th>Book Title</th>' + 
                //'<th>Description</th>' + 
                '<th>Authors</th>' + 
                '<th>ISBNs</th>' + 
                '<th>Publisher</th>' + 
                '<th>Published Date</th>' + 
                '<th>Rating</th>' + 
                '</tr>';
        $.each(data.items, function(index, book) {
            googleId = book.id;
            
            title = book.volumeInfo.title
            if (book.volumeInfo.hasOwnProperty('subtitle')) {
                title += ' ' + book.volumeInfo.subtitle;
            }
            
            description = '';
            if (book.volumeInfo.hasOwnProperty('description')) {
                description = book.volumeInfo.description;
            }
            
            authors = book.volumeInfo.authors;
            publisher = book.volumeInfo.publisher;
            
            pdate = 'N/A';
            if (book.volumeInfo.hasOwnProperty('publishedDate')) {
                pdate = book.volumeInfo.publishedDate;
            }
            
            thumbnail = book.volumeInfo.imageLinks.thumbnail;
            
            isbn = '';
            $.each(book.volumeInfo.industryIdentifiers, function(index, element) {
                if (isbn.length == 0) { 
                    isbn = element.identifier 
                } else {
                    isbn += ',' + element.identifier;
                }
            });
            
            available = false;
            if (book.saleInfo.country == 'AU') {
                if (book.saleInfo.saleability == 'FOR_SALE') {
                    available = true;
                }
            }
            
            rating = 0;
            if (book.volumeInfo.hasOwnProperty('averageRating')) {
                rating = book.volumeInfo.averageRating;
            }

            body += '<tr>' + 
                    '<td>' + title + '</td>' + 
                    //'<td>' + description + '</td>' + 
                    '<td>' + authors + '</td>' + 
                    '<td>' + isbn + '</td>' + 
                    '<td>' + publisher + '</td>' + 
                    '<td>' + pdate + '</td>' + 
                    '<td>' + (rating > 0.0 ? rating : 'N/A') + '</td>' + 
                    '</tr>';
        });
                
        $("#book_search_result").html(body);
    }
}

/**
 * 
 * @returns {undefined}
 */
function ajaxGoogleBookSearch() {
    text = $.trim($("#google_book_search_text").val());
    if (text.length == 0) return;
            
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + text,
        success: function(data) {
            displaySearchResult($.parseJSON(data));
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/*
 * 
 * @param {type} data
 * @returns {undefined}
 */
function previewBook(data) {
    totalItems = data.totalItems;
    if (totalItems == 0) {  // no book found
        $("#preview_thumbnail").attr("src", "");
        $("#preview_info").text("No book with such ISBN.");
    } else {
        $.each(data.items, function(index, book) {
            googleId = book.id;
            
            title = book.volumeInfo.title
            if (book.volumeInfo.hasOwnProperty('subtitle')) {
                title += ' ' + book.volumeInfo.subtitle;
            }
            
            description = '';
            if (book.volumeInfo.hasOwnProperty('description')) {
                description = book.volumeInfo.description;
            }
            
            authors = book.volumeInfo.authors;
            publisher = book.volumeInfo.publisher;
            
            pdate = 'N/A';
            if (book.volumeInfo.hasOwnProperty('publishedDate')) {
                pdate = book.volumeInfo.publishedDate;
            }
            
            thumbnail = book.volumeInfo.imageLinks.thumbnail;
            
            isbn = '';
            $.each(book.volumeInfo.industryIdentifiers, function(index, element) {
                if (isbn.length == 0) { 
                    isbn = element.identifier 
                } else {
                    isbn += ',' + element.identifier;
                }
            });
            
            available = false;
            if (book.saleInfo.country == 'AU') {
                if (book.saleInfo.saleability == 'FOR_SALE') {
                    available = true;
                }
            }
            
            rating = 0;
            if (book.volumeInfo.hasOwnProperty('averageRating')) {
                rating = book.volumeInfo.averageRating;
            }
            
            $("#preview_thumbnail").attr("src", thumbnail);
            $("#preview_info").html('<h2>' + title + '</h2>' +
                                    (description.length > 0 ? description + '<br/><br/>' : '') +
                                    '<b>Author:</b> ' + authors + '<br/>' +
                                    '<b>Publisher:</b> ' + publisher + '<br/>' +
                                    '<b>Published Date:</b> ' + pdate + '<br/>' +
                                    '<b>ISBN:</b> ' + isbn + '<br/>' +
                                    '<b>Book ID:</b> ' + googleId + '<br/>' +
                                    '<b>Rating:</b> ' + (rating > 0?rating:'N/A') + '<br/>' +
                                    '<b>Available in Australia:</b> ' + (available?'YES':'NO') + '<br/>');
        });
    }
}

/**
 * 
 * @returns {undefined}
 */
function checkISBN() {
    isbn = $.trim($("#request_book_isbn").val());
    if (isbn.length == 0) return;
        
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn,
        success: function(data) {
            previewBook($.parseJSON(data));
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @returns {undefined}
 */
function soapBookRequest() {
    studentId = $.trim($("#request_student_id").val());
    pin = $.trim($("#request_student_pin").val());
    bookIsbn = $.trim($("#request_book_isbn").val());
    
    $.soap({
	url: 'http://localhost:9763/services/StudentService.StudentServiceHttpSoap12Endpoint/',
	method: 'requestBook',
	data: {
            studentId: studentId,
            pin: pin,
            isbn: bookIsbn
	},
        envAttributes: {
            'xmlns:ns': 'http://waa.a1'
	},
        namespaceQualifier: 'ns',
	success: function (soapResponse) {
            // if you want to have the response as JSON use soapResponse.toJSON();
            // or soapResponse.toString() to get XML string
            // or soapResponse.toXML() to get XML DOM
            viewResultMessage(xmlToString(soapResponse.toXML()));
	},
	error: function (soapResponse) {
            // show error
            clearResult();
            displayError(xmlToString(SOAPResponse.content));
	}
    });    
}


/**
 * 
 * @param {type} id
 * @param {type} pin
 * @returns {undefined}
 */
function formViewStudentSoap(id, pin) {
    return  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://waa.a1">' +
            '<soap:Body>' +
                '<ns:viewStudent>' +
                    '<ns:id>' + id + '</ns:id>' +
                    '<ns:pin>' + pin + '</ns:pin>' +
                '</ns:viewStudent>' +
            '</soap:Body>' +
            '</soap:Envelope>';
}

/**
 * using jquery.soap: https://github.com/doedje/jquery.soap
 * @returns {undefined}
 */
function soapViewStudentRecord() {
    studentId = $.trim($("#soap_record_student_id").val());
    studentPin = $.trim($("#soap_record_student_pin").val());

    $.soap({
	url: 'http://localhost:9763/services/StudentService.StudentServiceHttpSoap12Endpoint/',
	method: 'viewStudent',
	data: {
            id: studentId,
            pin: studentPin
	},
        envAttributes: {
            'xmlns:ns': 'http://waa.a1'
	},
        namespaceQualifier: 'ns',
	success: function (soapResponse) {
            // if you want to have the response as JSON use soapResponse.toJSON();
            // or soapResponse.toString() to get XML string
            // or soapResponse.toXML() to get XML DOM
            viewStudentRecord(xmlToString(soapResponse.toXML()));
	},
	error: function (soapResponse) {
            // show error
            clearResult();
            displayError(xmlToString(SOAPResponse.content));
	}
    });
}

/**
 * 
 * @param {type} $xml
 * @returns {undefined}
 */
function displayStudentRecordTables($xml) {
    description = "<p>Student name: " + $xml.find('studentName').text() + "</p>";
    
    start = "<table><tr><th>Book ID</th><th>Book Title</th></tr>";
    start += "<tr><td colspan=2>Borrowed</td></tr>";
    
    body = "";
    $xml.find('borrow').each(function() {
        body += "<tr>";
        body += "<td>" + $(this).find('bookId').text() + "</td>";
        body += "<td>" + $(this).find('bookTitle').text() + "</td>";
        body += "</tr>";
    });
    
    body += "<tr><td colspan=2>Requested</td></tr>";
    $xml.find('request').each(function() {
        body += "<tr>";
        body += "<td>" + $(this).find('bookId').text() + "</td>";
        body += "<td>" + $(this).find('bookTitle').text() + "</td>";
        body += "</tr>";
    });
    
    end = "</table>";
    
    $("#div_result").html(description + start + body + end);    
}

/**
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewStudentRecord(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();

    $error = $xml.find('error');
    if ($error.length > 0) {
        displayError($error.text());
    } else {
        displayStudentRecordTables($xml);
    }
}

/**
 * 
 * @returns {undefined}
 */
function ajaxViewStudentRecord() {
    studentId = $.trim($("#record_student_id").val());
    studentPin = $.trim($("#record_student_pin").val());
    
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/student?id=' + studentId + '&pin=' + studentPin,
        dataType: 'text',
        success: function(data) {
            viewStudentRecord(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @param {type} id
 * @param {type} title
 * @param {type} author
 * @param {type} isbn
 * @param {type} publisher
 * @param {type} pdate
 * @returns {String}
 */
function formBorrowBookXml(studentId, pin, bookId) {
    return '<ns:borrowBook xmlns:ns="http://waa.a1">' +
        "<ns:studentId>" + studentId + "</ns:studentId>" +
	"<ns:pin>" + pin + "</ns:pin>" +
	"<ns:bookId>" + bookId + "</ns:bookId>" +
        "</ns:borrowBook>";
}

/**
 * 
 * @returns {undefined}
 */
function ajaxBorrowBook() {
    studentId = $.trim($("#borrow_student_id").val());
    pin = $.trim($("#borrow_student_pin").val());
    bookId = $.trim($("#borrow_book_id").val());
    
    xmlData = formBorrowBookXml(studentId, pin, bookId);
        
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/borrow',
        data: xmlData,
        contentType: 'application/xml',
        dataType: 'text',
        success: function(data) {
            viewResultMessage(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @param {type} id
 * @param {type} title
 * @param {type} author
 * @param {type} isbn
 * @param {type} publisher
 * @param {type} pdate
 * @returns {String}
 */
function formUpdateBookXml(id, title, author, isbn, publisher, pdate, status) {
    return '<ns:updateBook xmlns:ns="http://waa.a1">' +
        "<ns:id>" + id + "</ns:id>" +
	"<ns:title>" + title + "</ns:title>" +
	"<ns:author>" + author + "</ns:author>" +
	"<ns:isbn>" + isbn + "</ns:isbn>" +
	"<ns:publisher>" + publisher + "</ns:publisher>" +
	"<ns:pdate>" + pdate + "</ns:pdate>" +
        "<ns:status>" + status + "</ns:status>" +
        "</ns:updateBook>";
}

/**
 * 
 * @returns {undefined}
 */
function ajaxUpdateBook() {
    id = $("#update_book_id").val();
    title = $("#update_book_title").val();
    author = $("#update_book_author").val();
    isbn = $("#update_book_isbn").val();
    publisher = $("#update_book_publisher").val();
    pdate = $("#update_book_pdate").val();
    status = $("#update_book_status").val();
    
    xmlData = formUpdateBookXml(id, title, author, isbn, publisher, pdate, status);
    
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book',
        data: xmlData,
        contentType: 'application/xml',
        dataType: 'text',
        success: function(data) {
            viewResultMessage(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @param {type} title
 * @param {type} author
 * @param {type} isbn
 * @param {type} publisher
 * @param {type} pdate
 * @returns {String}
 */
function formAddBookXml(title, author, isbn, publisher, pdate) {
    return '<ns:addBook xmlns:ns="http://waa.a1">' +
	"<ns:title>" + title + "</ns:title>" +
	"<ns:author>" + author + "</ns:author>" +
	"<ns:isbn>" + isbn + "</ns:isbn>" +
	"<ns:publisher>" + publisher + "</ns:publisher>" +
	"<ns:pdate>" + pdate + "</ns:pdate>" +
        "</ns:addBook>";
}

/**
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewResultMessage(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();

    $error = $xml.find('error');
    if ($error.length > 0) {
        displayError($error.text());
    } else {
        displayMessage($xml.find('ok').text());
    }
}

/**
 * 
 * @returns {undefined}
 */
function ajaxAddBook() {
    title = $("#add_book_title").val();
    author = $("#add_book_author").val();
    isbn = $("#add_book_isbn").val();
    publisher = $("#add_book_publisher").val();
    pdate = $("#add_book_pdate").val();;
    
    xmlData = formAddBookXml(title, author, isbn, publisher, pdate);
        
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book',
        data: xmlData,
        contentType: 'application/xml',
        dataType: 'text',
        success: function(data) {
            viewResultMessage(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * 
 * @param {type} $xml
 * @returns {undefined}
 */
function displayBooksTable($xml) {
    start = "<table><tr><th>ID</th><th>Title</th><th>Author</th><th>ISBN</th><th>Publisher</th><th>Published Date</th><th>Status</th></tr>";
    body = "";
    $xml.find('book').each(function() {
        body += "<tr>";
        body += "<td>" + $(this).find('id').text() + "</td>";
        body += "<td>" + $(this).find('title').text() + "</td>";
        body += "<td>" + $(this).find('author').text() + "</td>";
        body += "<td>" + $(this).find('isbn').text() + "</td>";
        body += "<td>" + $(this).find('publisher').text() + "</td>";
        body += "<td>" + $(this).find('pdate').text() + "</td>";
        status = 'unknown';
        color = "green";
        switch ($(this).find('status').text()) {
            case '0':
                status = 'Available'; break;
            case '1':
                status = 'On Loan'; color = "red"; break;
            case '2':
                status = 'Back Order'; color = "blue"; break;
        }
        body += "<td style='color:" + color + "'>" + status + "</td>";
        body += "</tr>";
    });
    end = "</table>";
    $("#div_result").html(start + body + end);    
}

/**
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewBook(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();

    $error = $xml.find('error');
    if ($error.length > 0) {
        displayError($error.text());
    } else {
        displayBooksTable($xml);
    }
}

/**
 * 
 * @returns {undefined}
 */
function ajaxViewBook() {
    bookId = $("#view_book_id").val();
            
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book/' + bookId,
        dataType: 'text',
        success: function(data) {
            viewBook(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });

}

/**
 * 
 * @param {type} xmlData
 * @returns {undefined}
 */
function viewAllBooks(xmlData) {
    var xml = $.parseXML(xmlData);
    $xml = $(xml);
    
    clearResult();
    clearError();
    
    displayBooksTable($xml);
}

/**
 * 
 * @returns {undefined}
 */
function ajaxViewAllBooks() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/books',
        dataType: 'text',
        success: function(data) {
            viewAllBooks(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            clearResult();
            displayError(errorThrown);
        }
    });
}

/**
 * unused
 * @returns {undefined}
 */
function ajaxDeleteObject() {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:9763/services/BookService.BookServiceHttpEndpoint/book',
        dataType: 'text',
        success: function(data) {
            viewResultMessage(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            clearResult();
            displayError(errorThrown);
        }
    });
}
