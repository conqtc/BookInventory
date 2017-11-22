package studentservice.a2.waa;

import java.util.*;

import org.apache.axiom.om.*;

import javax.xml.namespace.*;


class Student {
	// properties
	public String studentid;
	public String studentName;
	
	/**
	 * 
	 * @param id
	 * @param name
	 * @param pin
	 */
	public Student(String studentid) {
		this.studentid = studentid;
	}
		
	/**
	 * 
	 * @return
	 */
	public OMElement toElement() {
	    OMFactory factory = OMAbstractFactory.getOMFactory();
	    // <student>
	    OMElement element = factory.createOMElement(new QName("student"));
        // <studentId>
	    OMElement subElement = factory.createOMElement("studentId", null, element);
        OMText text = factory.createOMText(subElement, "" + this.studentid);
        // <studentName>
	    subElement = factory.createOMElement("studentName", null, element);
        text = factory.createOMText(subElement, this.studentName);
        
        return element;
	}
}