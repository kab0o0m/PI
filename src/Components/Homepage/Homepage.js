import { useState } from "react";
import "./Homepage.css";
import axios from "axios";

const Homepage = () => {
  const initialFormData = {
    case_code: "",
    client_name: "",
    client_contact: "",
    tutor_name: "",
    tutor_contact: "",
    first_lesson_data_time: "",
    rate: "",
    commission: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [textOutput1, setTextOutput1] = useState(" ");
  const [textOutput2, setTextOutput2] = useState(" ");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchCase = async (caseCode) => {
    console.log("hi");
    const url = "https://admin.premiumtutors.sg/api/assignments";
    const response = await axios.get(url);

    if (response.status === 200) {
      const data = response.data;
      for (let i = 0; i < data.assignments.length; i++) {
        if (caseCode === data.assignments[i].code) {
          return data.assignments[i];
        }
      }
    } else {
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const caseCode = formData["case_code"];
    const clientName = formData["client_name"];
    const clientContact = formData["client_contact"];
    const tutorName = formData["tutor_name"];
    const tutorContact = formData["tutor_contact"];
    const firstLesson = formData["first_lesson_data_time"];
    const rate = formData["rate"];

    const assignment = await fetchCase(caseCode);
    console.log(assignment);
    const assignmentContent = assignment.content;
    const assignmentCommission = assignment.commission;
    const assignmentDuration = assignment.duration;
    const assignmentLocation = assignment.location;

    let confirmationMessage = "";
    confirmationMessage = `Lessons are confirmed to start on ${firstLesson} with ${clientName}. If there are no issues, lessons will be ${assignmentDuration}. The rate will be ${rate}\n\nAn invoice, which will include both contact and payment details, will be issued to you within the next 1-2 days.\n\nShould you find it necessary to discontinue the lessons earlier than the quantity specified on the invoice, please note that you are only obliged to pay for the lessons that have been provided up to that point. Payment is requested upon the completion of the lessons. Please remit payments for subsequent lessons directly to the tutor only after settling the invoice amount with our company.\n\nRest assured, there are no hidden or additional fees. Your financial obligation is limited to the cost of the lessons delivered and any expenses for materials procured by the tutor, should they arise.\n\nWe thank you for your engagement and are here to support a seamless educational experience.`;

    // First text area
    setTextOutput1(confirmationMessage);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setTextOutput1("");
    setTextOutput2("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="form-input">
        <form action="" onSubmit={handleSubmit}>
          <div className="case_code">
            <label htmlFor="case_code">Case Code</label>
            <input
              type="text"
              id="case_code"
              name="case_code"
              value={formData.case_code}
              onChange={handleInputChange}
              placeholder="BDYJS311"
            />
          </div>
          <div className="client_name">
            <label htmlFor="client_name">Client Name</label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              placeholder="Mr James"
            />
          </div>
          <div className="client_contact">
            <label htmlFor="client_contact">Client Contact</label>
            <input
              type="text"
              id="client_contact"
              name="client_contact"
              value={formData.client_contact}
              onChange={handleInputChange}
              placeholder="91234567"
            />
          </div>
          <div className="tutor_name">
            <label htmlFor="tutor_name">Tutor Name</label>
            <input
              type="text"
              id="tutor_name"
              name="tutor_name"
              value={formData.tutor_name}
              onChange={handleInputChange}
              placeholder="91234567"
            />
          </div>
          <div className="tutor_contact">
            <label htmlFor="tutor_contact">Tutor Contact</label>
            <input
              type="text"
              id="tutor_contact"
              name="tutor_contact"
              value={formData.tutor_contact}
              onChange={handleInputChange}
              placeholder="91234567"
            />
          </div>
          <div className="first_lesson_data_time">
            <label htmlFor="first_lesson_data_time">
              First Lesson Date & Time
            </label>
            <input
              type="text"
              id="first_lesson_data_time"
              name="first_lesson_data_time"
              value={formData.first_lesson_data_time}
              onChange={handleInputChange}
              placeholder="91234567"
            />
          </div>
          <div className="rate">
            <label htmlFor="rate">Rate</label>
            <input
              type="text"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              placeholder="91234567"
            />
          </div>
          <div className="button">
            <button className="submit-form">
              <input type="submit" id="submit" value="Submit" />
            </button>
            <button
              type="button"
              id="clear"
              onClick={handleReset}
              className="clear-form"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
      <div className="convert-output">
        <div className="convert-output-title">
          <h3>Confirmation Template</h3>
          <textarea
            name=""
            id=""
            cols="50"
            rows="30"
            value={textOutput1}
            onChange={(e) => setTextOutput1(e.target.value)}
          ></textarea>
        </div>

        <div className="convert-output-title-2">
          <h3>Invoice Template</h3>
          <textarea
            name=""
            id=""
            cols="50"
            rows="30"
            value={textOutput2}
            onChange={(e) => setTextOutput2(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
