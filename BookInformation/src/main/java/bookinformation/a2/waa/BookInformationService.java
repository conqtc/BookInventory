package bookinformation.a2.waa;

import javax.xml.namespace.*;

import org.apache.axiom.om.*;

// for Google Books APIs
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.books.*;
import com.google.api.services.books.Books.Volumes.*;
import com.google.api.services.books.model.*;
import com.google.api.services.books.model.Volume.VolumeInfo.IndustryIdentifiers;

public class BookInformationService {

	/**
	 * Constructor
	 */
	public BookInformationService() {
	}

	/**
	 * 
	 * @param error
	 * @return 
	 * <book>
	 * <status>yes</status>
	 * <title> _ <title>
	 * <authors> _ </authors>
	 * <publisher> _ </publisher>
	 * <isbn> _ </isbn>
	 * </book>
	 */
	private OMElement okElement(Book book) {
		OMFactory factory = OMAbstractFactory.getOMFactory();

		// <book>
		OMElement element = factory.createOMElement(new QName("book"));
        // <status>
	    OMElement subElement = factory.createOMElement("status", null, element);
        OMText text = factory.createOMText(subElement, "yes");
        // <title>
	    subElement = factory.createOMElement("title", null, element);
        text = factory.createOMText(subElement, book.title);
        // <author>
	    subElement = factory.createOMElement("authors", null, element);
        text = factory.createOMText(subElement, book.authors);
        // <publisher>
	    subElement = factory.createOMElement("publisher", null, element);
        text = factory.createOMText(subElement, book.publisher);
        // <isbn>
	    subElement = factory.createOMElement("isbn", null, element);
        text = factory.createOMText(subElement, book.isbn);
        // <pdate>
        subElement = factory.createOMElement("pdate", null, element);
        text = factory.createOMText(subElement, book.pdate);

        return element;
	}

	/**
	 * 
	 * @param error
	 * @return
	 * <book>
	 * <status>no</status>
	 * <title> error description <title>
	 * </book>
	 */
	private OMElement errorElement(String error) {
		OMFactory factory = OMAbstractFactory.getOMFactory();

		// <book>
		OMElement element = factory.createOMElement(new QName("book"));
        // <status>
	    OMElement subElement = factory.createOMElement("status", null, element);
        OMText text = factory.createOMText(subElement, "no");
        // <title>: error description
	    subElement = factory.createOMElement("title", null, element);
        text = factory.createOMText(subElement, error);

		return element;
	}

	/**
	 * Code reference from Google Books APIs for Java Samples
	 * @param jsonFactory
	 * @param query
	 * @throws Exception
	 */
	private static Book queryGoogleBooks(JsonFactory jsonFactory, String query)
			throws Exception {
		final String APP_NAME = "BookInventory";
		final String API_KEY = "AIzaSyCaS6Z0DVCt12ngyCz3jz7f7FoNoAs3IO4";
		
		// Set up Books client.
		final Books books = new Books.Builder(
				GoogleNetHttpTransport.newTrustedTransport(), jsonFactory, null)
				.setApplicationName(APP_NAME)
				.setGoogleClientRequestInitializer(new BooksRequestInitializer(API_KEY))
				.build();
		
		// Get list of volumes result
		List volumesList = books.volumes().list(query);

		// Execute the query.
		Volumes volumes = volumesList.execute();
		if (volumes.getTotalItems() == 0 || volumes.getItems() == null) {
			System.out.println("No matches found.");
			return null;
		}
		
		Book book = new Book();

		// loop through all the volumes
		for (Volume volume : volumes.getItems()) {
			Volume.VolumeInfo volumeInfo = volume.getVolumeInfo();
			Volume.SaleInfo saleInfo = volume.getSaleInfo();
			
			// title
			book.title = volumeInfo.getTitle();

			// authors
			book.authors = "";
			java.util.List<String> authors = volumeInfo.getAuthors();
			if (authors != null && !authors.isEmpty()) {
				for (int i = 0; i < authors.size(); i++) {
					book.authors += authors.get(i);
					if (i < authors.size() - 1) {
						book.authors += ", ";
					}
				}
			}
			
			// ISBNs
			book.isbn = "";
			java.util.List<IndustryIdentifiers> isbnList = volumeInfo.getIndustryIdentifiers();
			if (isbnList != null && !isbnList.isEmpty()) {
				for (int i = 0; i < isbnList.size(); i++) {
					book.isbn += isbnList.get(i).getIdentifier();
					if (i < isbnList.size() - 1) {
						book.isbn += ",";
					}
				}
			}
			
			// publisher
			book.publisher = "N/A";
			if (volumeInfo.getPublisher() != null) {
				book.publisher = volumeInfo.getPublisher();
			}
			
			// published date
			book.pdate = "N/A";
			if (volumeInfo.getPublishedDate() != null) {
				book.pdate = volumeInfo.getPublishedDate();
			}

			// Rating
			book.rating = 0.0;
			if (volumeInfo.getRatingsCount() != null && volumeInfo.getRatingsCount() > 0) {
				book.rating = volumeInfo.getAverageRating().doubleValue();
			}

			// Available in Australia?
			book.availableInAu = false;
			if (saleInfo != null && 
				"AU".equals(saleInfo.getCountry()) &&
				"FOR_SALE".equals(saleInfo.getSaleability())) {
				book.availableInAu = true;
			}
			
			// only get the first result
			break;
		}
		
		return book;
	}


	/**
	 * 
	 * @param studentId
	 * @param pin
	 * @param isbn
	 * @return
	 */
	public OMElement getBookInfo(String isbn) {
		try {
			// query the book from google
			JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
			String query = "isbn:" + isbn;
			try {
				Book book = queryGoogleBooks(jsonFactory, query);
				if (book == null) {
					return errorElement("No book found with such isbn.");
				} else {
					// rating must be at least 3
					if (book.rating < 3) {
						return errorElement("Book rating is N/A or insufficient (ie. less than 3.0)");
					}
					// must be for sale in AU
					if (!book.availableInAu) {
						return errorElement("Book is NOT available in Australia.");
					}
					
					return okElement(book);
				}
			} catch (Exception e) {
				return errorElement("Unable to retrieve book info from Google: " + e.getMessage());
			}
		} catch (Exception e) {
			return errorElement("Unable to retrieve book info from Google");
		}
	}
}