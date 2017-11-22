<html>
<head>
    <title></title>
    <link rel="stylesheet" type="text/css" href="style.css?<?php echo time(); ?>">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="jquery.soap.js"></script>
    <script>
        $( function() {
            $("#add_book_pdate").datepicker({ dateFormat: 'yy-mm-dd' });
            $("#update_book_pdate").datepicker({ dateFormat: 'yy-mm-dd' });
        });
    </script>
</head>
<body>
    <script type="text/javascript" src="script.js?<?php echo time(); ?>"></script>
    <h1>Booking System</h1>
    <p>Select one of these items, fill in all details, then click "Execute" button.</p>
    
    <p><b>Book Services</b></p>
    <input type="radio" name="menu" value="div_view_all_book" onchange="menuSelectionChanged()">View All Books<br>
    <input type="radio" name="menu" value="div_view_book" onchange="menuSelectionChanged()">View Book Detail<br>
    <input type="radio" name="menu" value="div_add_book" onchange="menuSelectionChanged()">Add New Book<br>
    <input type="radio" name="menu" value="div_update_book" onchange="menuSelectionChanged()">Update Existing Book<br>
    <input type="radio" name="menu" value="div_student_borrow" onchange="menuSelectionChanged()">Borrow A Book<br>
    <input type="radio" name="menu" value="div_student_request" onchange="menuSelectionChanged()">Request New Book<br>    
    <input type="radio" name="menu" value="div_google_book_search" onchange="menuSelectionChanged()">Google Book Search<br>
    <input type="radio" name="menu" value="div_student_record" onchange="menuSelectionChanged()">View Student Record Details<br>
    
    <p><b>Student Services</b></p>
    <input type="radio" name="menu" value="div_soap_student_record" onchange="menuSelectionChanged()">View Student Record Details (SOAP)<br>
    <input type="radio" name="menu" value="div_student_request_server" onchange="menuSelectionChanged()">Request New Book (SOAP, server side validation)<br>    
`
    <div id="div_view_all_book" style="display: none">
    </div>
    
    <div id="div_view_book" style="display: none">
        <h3>View Book Detail</h3>
        <p>Book ID: <input type="text" id="view_book_id"></p>
    </div>
    
    <div id="div_add_book" style="display: none">
        <h3>Add New Book</h3>
        <table class="form">
            <tr>
                <td>Book Title:</td>
                <td><input type="text" id="add_book_title"></td>
            </tr>
            <tr>
                <td>Author(s):</td>
                <td><input type="text" id="add_book_author"></td>
            </tr>
            <tr>
                <td>ISBN:</td>
                <td><input type="text" id="add_book_isbn"></td>
            </tr>
            <tr>
                <td>Publisher:</td>
                <td><input type="text" id="add_book_publisher"></td>
            </tr>
            <tr>
                <td>Published Date:</td>
                <td><input type="text" id="add_book_pdate"></td>
            </tr>
        </table>
    </div>

    <div id="div_update_book" style="display: none">
        <h3>Update Existing Book</h3>
        <table class="form">
            <tr>
                <td>Book ID:</td>
                <td><input type="text" id="update_book_id" onblur="checkUpdateBookId()"> <button type="button" onclick="checkUpdateBookId()">Check</button></td>
            </tr>
            <tr>
                <td>Title:</td>
                <td><input type="text" id="update_book_title"></td>
            </tr>
            <tr>
                <td>Author(s):</td>
                <td><input type="text" id="update_book_author"></td>
            </tr>
            <tr>
                <td>ISBN:</td>
                <td><input type="text" id="update_book_isbn"></td>
            </tr>
            <tr>
                <td>Publisher:</td>
                <td><input type="text" id="update_book_publisher"></td>
            </tr>
            <tr>
                <td>Published Date:</td>
                <td><input type="text" id="update_book_pdate"></td>
            </tr>
            <tr>
                <td>Status:</td>
                <td>
                    <select id="update_book_status">
                        <option value="0">Available</option>
                        <option value="1">On Loan</option>
                        <option value="2">Back Order</option>
                    </select>
                </td>
            </tr>
        </table>
    </div>

    <div id="div_student_record" style="display: none">
        <h3>View Student Record</h3>
        <table class="form">
            <tr>
                <td>Student ID:</td>
                <td><input type="text" id="record_student_id"></td>
            </tr>
            <tr>
                <td>PIN:</td>
                <td><input type="password" id="record_student_pin"></td>
            </tr>
        </table>
    </div>

    <div id="div_soap_student_record" style="display: none">
        <h3>View Student Record (SOAP)</h3>
        <table class="form">
            <tr>
                <td>Student ID:</td>
                <td><input type="text" id="soap_record_student_id"></td>
            </tr>
            <tr>
                <td>PIN:</td>
                <td><input type="password" id="soap_record_student_pin"></td>
            </tr>
        </table>
    </div>

    <div id="div_student_borrow" style="display: none">
        <h3>Borrow A Book</h3>
        <table class="form">
            <tr>
                <td>Student ID:</td>
                <td><input type="text" id="borrow_student_id"></td>
            </tr>
            <tr>
                <td>PIN:</td>
                <td><input type="password" id="borrow_student_pin"></td>
            </tr>
            <tr>
                <td>Book ID:</td>
                <td><input type="text" id="borrow_book_id" onblur="checkBorrowBookId()"> <button type="button" onclick="checkBorrowBookId()">Check</button></td>
            </tr>
        </table>
        <table class="form">
            <tr><td id="borrow_book_info"></td></tr>
        </table>
    </div>
    
    <div id="div_student_request" style="display: none">
        <h3>Request New Book</h3>
        <table class="form">
            <tr>
                <td>Student ID:</td>
                <td><input type="text" id="request_student_id"></td>
            </tr>
            <tr>
                <td>PIN:</td>
                <td><input type="password" id="request_student_pin"></td>
            </tr>
            <tr>
                <td>Book ISBN:</td>
                <td><input type="text" id="request_book_isbn" onkeyup="isbnChanged()" onblur="checkISBN()"> <button onclick="checkISBN()" id="check_isbn" disabled="true">Check</button></td>
            </tr>
        </table>

        <table class="form">
            <tr>
                <td><img id="preview_thumbnail"></td>
                <td id="preview_info"></td>
            </tr>
        </table>
    </div>

    <div id="div_google_book_search" style="display: none">
        <h3>Google Book Search</h3>
        <table class="form">
            <tr>
                <td>Search Text:</td>
                <td><input type="text" id="google_book_search_text"></td>
            </tr>
        </table>

        <table id="book_search_result">
        </table>
    </div>

    <p><button onclick="execute()">Execute</button></p>
    
    <div id="div_error" style="color: red"></div>
    <div id="div_result"></div>
</body>
<?php
?>
</html>
