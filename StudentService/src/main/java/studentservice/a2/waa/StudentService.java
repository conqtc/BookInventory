package studentservice.a2.waa;

import java.sql.*;

import javax.xml.namespace.*;

import org.apache.axiom.om.*;

public class StudentService {

	// Mysql components
	private Connection connection = null;
	private Statement statement = null;
	private ResultSet resultSet = null;

	/**
	 * Constructor
	 */
	public StudentService() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			connection = DriverManager
					.getConnection("jdbc:mysql://localhost/waa?user=pma&password=abc12345");
			statement = connection.createStatement();
		} catch (Exception e) {

		}
	}

	/**
	 * 
	 * @param message
	 * @return <result>message</result>
	 */
	private OMElement resultElement(String message) {
		OMFactory factory = OMAbstractFactory.getOMFactory();

		OMElement element = factory.createOMElement(new QName("result"));
		OMText text = factory.createOMText(element, message);

		return element;
	}

	/**
	 * 
	 * @param id
	 * @param pin
	 * @return <result>yes/no</result>
	 */
	public String validateStudent(String id, String pin) {
		try {
			// check student id
			resultSet = statement
					.executeQuery("SELECT name FROM student WHERE id = '" + id
							+ "' AND pin = '" + pin + "'");
			if (resultSet.next()) {
				//return resultElement("yes");
				return "yes";
			} else {
				return "no";
				//return resultElement("no");
			}
		} catch (Exception e) {
			//return resultElement("no");
			return "no";
		}
	}	
}