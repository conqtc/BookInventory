package bookinventory.a2.waa;

import java.util.*;
import java.sql.*;

import org.apache.axiom.om.*;
import javax.xml.namespace.*;

public class BookInventoryService {

	// Mysql components
	private Connection connection = null;
    private Statement statement = null;
    private PreparedStatement preparedStatement = null;
    private ResultSet resultSet = null;

	/**
	 * Constructor
	 */
	public BookInventoryService() {
    	try {
    		Class.forName("com.mysql.jdbc.Driver");
    		connection = DriverManager.getConnection("jdbc:mysql://localhost/waa?user=pma&password=abc12345");
    		statement = connection.createStatement();
    	} catch (Exception e) {
    		
    	}
	}
	
	/**
	 * 
	 * @param error
	 * @return
	 */
	private OMElement resultElement(String message) {
	    OMFactory factory = OMAbstractFactory.getOMFactory();
	    
	    OMElement element = factory.createOMElement(new QName("result"));
        OMText text = factory.createOMText(element, message);
		
        return element;
	}
	
	/**
	 * 
	 * @return
	 */
	public OMElement viewAllBooks() {
		ArrayList<Book> books = new ArrayList<>();
		
		try {
			// select all
			resultSet = statement.executeQuery("SELECT id, title, author, isbn, publisher, pdate, status FROM book");
			
			// loop through all records
			while (resultSet.next()) {
				Book book = new Book(resultSet.getInt(1),		// id
						             resultSet.getString(2),	// title
						             resultSet.getString(3),	// author
						             resultSet.getString(4),	// isbn
						             resultSet.getString(5),	// publisher
						             resultSet.getString(6),	// published date
						             resultSet.getInt(7));		// status
				books.add(book);
			}
						
			// export to XML
		    OMFactory factory = OMAbstractFactory.getOMFactory();
		    OMElement booksElement = factory.createOMElement(new QName("books"));

			for (int index = 0; index < books.size(); index++) {
				OMElement bookElement = books.get(index).toElement();
				booksElement.addChild(bookElement);
			}
			return booksElement;
		} catch (Exception e) {
			return resultElement(e.getMessage());
		}
	}

	public OMElement viewBook(int bookId) {
		Book book = null;
		try {
			// select all
			resultSet = statement.executeQuery("SELECT id, title, author, isbn, publisher, pdate, status, gid FROM book WHERE id = " + bookId);
			// loop through all records
			while (resultSet.next()) {
				book = new Book(resultSet.getInt(1),		// id
					            resultSet.getString(2),		// title
						        resultSet.getString(3),		// author
						        resultSet.getString(4),		// isbn
						        resultSet.getString(5),		// publisher
						        resultSet.getString(6),		// published date
						        resultSet.getInt(7));		// status
			}
			
			// export to XML
			if (book == null) {
				return resultElement("No book found");
			} else {
				return book.toElement();
			}
		} catch (Exception e) {
			return resultElement(e.getMessage());
		}
	}
		
	/**
	 * 
	 * @param title
	 * @param author
	 * @param isbn
	 * @param publisher
	 * @param pdate
	 * @return <result>bookid/no</result>
	 */
	public OMElement addOrderBook(String title, String author, String isbn, String publisher, String pdate) {
		try {
			preparedStatement = connection.prepareStatement("INSERT INTO book(title, author, isbn, publisher, pdate, status) " + 
				"VALUES(?, ?, ?, ?, ?, 2)", Statement.RETURN_GENERATED_KEYS);
			preparedStatement.setString(1, title);
			preparedStatement.setString(2, author);
			preparedStatement.setString(3, isbn);
			preparedStatement.setString(4, publisher);
			preparedStatement.setString(5, pdate);
			
			int row = preparedStatement.executeUpdate();
			if (row > 0) {
				resultSet = preparedStatement.getGeneratedKeys();
				resultSet.next();
				return resultElement(Integer.toString(resultSet.getInt(1)));
			} else {
				return resultElement("no");
			}
		} catch (Exception e) {
			return resultElement("no");
		}
	}
		
	/**
	 * 
	 * @param isbn
	 * @return yes/no 
	 */
	public String validateBook(String isbn) {
		try {
			// check the isbn in the database
			resultSet = statement.executeQuery("SELECT id FROM book WHERE " + 
											   "isbn LIKE '" + isbn + ",%' OR isbn LIKE '%," + isbn + "'");
			if (resultSet.next()) {
				// book already exists
				return "no";
			}
			
			// no book in the database, good to go
			return "yes";
		} catch (Exception e) {
			return "no";
		}
	}

	
}