package bookinventory.a2.waa;

import org.apache.axiom.om.*;
import javax.xml.namespace.*;

class Book {
	// properties
	public int id;
	public String title;
	public String author;
	public String isbn;
	public String publisher;
	public String pdate;
	public int status;
	
	// book status
	public static final int AVAILABLE = 0;
	public static final int LOAN = 1;
	public static final int ORDER = 2;
		
	/**
	 * 
	 * @param id
	 * @param title
	 * @param author
	 * @param isbn
	 * @param publisher
	 * @param pdate
	 * @param status
	 */
	public Book(int id, String title, String author, String isbn, String publisher, String pdate, int status) {
		this.id = id;
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.publisher = publisher;
		this.pdate = pdate;
		this.status = status;
	}
	
	/**
	 * 
	 * @return
	 */
	public String toXML() {
		return 
		"<book>" +
			"<id>" + this.id + "</id>" +
			"<title>" + this.title + "</title>" +
			"<author>" + this.author + "</author>" +
			"<isbn>" + this.isbn + "</isbn>" +
			"<publisher>" + this.publisher + "</publisher>" +
			"<pdate>" + this.pdate + "</pdate>" + 
			"<status>" + this.status + "</status>" +
		"</book>";
	}
	
	public OMElement toElement() {
	    OMFactory factory = OMAbstractFactory.getOMFactory();
	    
	    OMElement element = factory.createOMElement(new QName("book"));
        
	    OMElement subElement = factory.createOMElement("id", null, element);
        OMText text = factory.createOMText(subElement, "" + this.id);

	    subElement = factory.createOMElement("title", null, element);
        text = factory.createOMText(subElement, this.title);

	    subElement = factory.createOMElement("author", null, element);
        text = factory.createOMText(subElement, this.author);

	    subElement = factory.createOMElement("isbn", null, element);
        text = factory.createOMText(subElement, this.isbn);

	    subElement = factory.createOMElement("publisher", null, element);
        text = factory.createOMText(subElement, this.publisher);

	    subElement = factory.createOMElement("pdate", null, element);
        text = factory.createOMText(subElement, this.pdate);
	    
        subElement = factory.createOMElement("status", null, element);
        text = factory.createOMText(subElement, "" + this.status);

        return element;
	}
}