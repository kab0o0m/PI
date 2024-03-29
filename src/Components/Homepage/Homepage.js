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
    frequencyDuration: "",
    commission: "",
    commissionPerHour: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [textOutput1, setTextOutput1] = useState(" ");
  const [textOutput2, setTextOutput2] = useState(" ");
  const [isCopy1, setIsCopy1] = useState(false);
  const [isCopy2, setIsCopy2] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text successfully copied to clipboard");
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchCase = async (caseCode) => {
    try {
      const assignmentResponses = {}; // Initialize an empty hashmap
      let pageNo = 0;
      let hasMorePages = true;

      while (hasMorePages) {
        let url = `https://admin.premiumtutors.sg/api/assignments?pageNo=${pageNo}&showAll=yes&pageSize=100`;
        const response = await axios.get(url);
        const assignments = response.data.data; // Store the response in the hashmap
        // Check if there are more pages by examining the response data

        for (const assignment of assignments) {
          const code = assignment.code;
          assignmentResponses[code] = assignment;
        }

        if (response.data.data.length < 1) {
          hasMorePages = false;
        } // Assuming the response data contains an array of assignments

        pageNo++; // Move to the next page
      }

      if (assignmentResponses[caseCode]) {
        return assignmentResponses[caseCode];
      }
    } catch (error) {
      console.log(error);
      alert("No assignment found");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCopy1(false);
    setIsCopy2(false);

    const caseCode = formData["case_code"].trim();
    let clientName = formData["client_name"].trim();
    clientName = clientName.charAt(0).toUpperCase() + clientName.slice(1);
    const clientContact = formData["client_contact"].trim();
    let tutorName = formData["tutor_name"].trim();
    tutorName = tutorName.charAt(0).toUpperCase() + tutorName.slice(1);
    const tutorContact = formData["tutor_contact"].trim();
    const firstLesson = formData["first_lesson_data_time"].trim();
    const rate = formData["rate"].trim();
    let frequencyDuration = formData["frequencyDuration"].trim();
    let commission = formData["commission"].trim();
    let commissionPerHour = formData["commissionPerHour"];

    let assignmentContent = "";
    let assignmentLevel = "";
    let assignmentLocation = "";
    let assignmentFrequencyDuration = "";
    let assignmentFrequency = "";
    let assignmentDuration = "";
    let assignmentDurationType = "";
    let assignmentFeesPerLesson = "";
    let totalCommissionFees = "";

    //Fetch assignment using assignment code from backend
    const assignment = await fetchCase(caseCode);

    if (assignment) {
      assignmentContent = assignment.content;
      assignmentLevel = assignmentContent
        .split("\n")[0]
        .split("@")[0]
        .split("(")[0];

      assignmentLocation = assignment.location;
      if (!commission) {
        commission = assignment.commission.replace(/[a-zA-Z]/g, "").trim();
      }
    } else {
      alert("Unable to find assignment!");
    }

    // Handle frequency, duration and duration type
    if (frequencyDuration) {
      assignmentFrequencyDuration = frequencyDuration;
    } else {
      assignmentFrequencyDuration = assignment.duration;
    }
    assignmentFrequency = assignmentFrequencyDuration.split("x")[0];
    assignmentDuration = assignmentFrequencyDuration
      .split("x")[1]
      .replace(/\/week.*/, "/week")
      .replace(/\s/g, "");
    if (assignmentDuration.includes("hour")) {
      assignmentDurationType = "hour";
    } else if (assignmentDuration.includes("mins")) {
      assignmentDurationType = assignmentDuration.match(/\d+mins/)[0];
    }

    //Handle fees calculation when /hour or /45mins
    if (assignmentDurationType.includes("hour")) {
      assignmentFeesPerLesson =
        assignmentDuration.replace(/[^0-9.]/g, "").trim() * rate;
    } else if (assignmentDurationType.includes("mins")) {
      assignmentFeesPerLesson = rate;
    } else {
      assignmentFeesPerLesson = "";
    }

    if (!commissionPerHour) {
      totalCommissionFees = assignmentFeesPerLesson * commission;
    } else {
      totalCommissionFees = rate * commissionPerHour;
    }

    let confirmationMessage = "";
    confirmationMessage = `Confirmed Lesson Details are as follows:\n\nDate & Time: ${firstLesson}\nTutor Name: ${tutorName}\nFrequency & duration of lessons: ${assignmentFrequencyDuration}\nRate: $${rate}/${assignmentDurationType}\nFee for 1 lesson: $${assignmentFeesPerLesson}/lesson\n\nAn invoice, which will include both contact and payment details, will be issued to you within the next 1-2 days.\n\nShould you find it necessary to discontinue the lessons earlier than the quantity specified on the invoice, please note that you are only obliged to pay for the lessons that have been provided up to that point. Payment is requested upon the completion of the lessons. Please remit payments for subsequent lessons directly to the tutor only after settling the invoice amount with our company.\n\nRest assured, there are no hidden or additional fees. Your financial obligation is limited to the cost of the lessons delivered and any expenses for materials procured by the tutor, should they arise.\n\nWe thank you for your engagement and are here to support a seamless educational experience.`;

    // First text area
    setTextOutput1(confirmationMessage);

    let invoiceMessage = "";
    let additionalMessage = "";
    if (commissionPerHour) {
      additionalMessage = `(${commissionPerHour} hours) `;
    }
    invoiceMessage = `${caseCode} ${tutorContact}\n\n${assignmentLevel}\n\nTutor Name: ${tutorName} (HP: ${tutorContact})\nClient Name: ${clientName} (HP: ${clientContact})\n\nTuition Location: ${assignmentLocation}\nFirst Lesson: ${firstLesson}\nRate: $${rate}/${assignmentDurationType}\nIf there are no issues, lessons will be ${assignmentFrequencyDuration}. The rate will be $${rate}/${assignmentDurationType}, $${assignmentFeesPerLesson}/lesson.\n\nCommission: Fees for the first ${commission} lessons ${additionalMessage}will be collected by our Company, amounting $${totalCommissionFees}`;
    setTextOutput2(invoiceMessage);
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
            <label htmlFor="case_code">Case Code*</label>
            <input
              type="text"
              id="case_code"
              name="case_code"
              value={formData.case_code}
              onChange={handleInputChange}
              placeholder="BDYJS311"
              required
            />
          </div>
          <div className="client_name">
            <label htmlFor="client_name">Client Name*</label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              placeholder="Mr James"
              required
            />
          </div>
          <div className="client_contact">
            <label htmlFor="client_contact">Client Contact*</label>
            <input
              type="text"
              id="client_contact"
              name="client_contact"
              value={formData.client_contact}
              onChange={handleInputChange}
              placeholder="91234567"
              required
            />
          </div>
          <div className="tutor_name">
            <label htmlFor="tutor_name">Tutor Name*</label>
            <input
              type="text"
              id="tutor_name"
              name="tutor_name"
              value={formData.tutor_name}
              onChange={handleInputChange}
              placeholder="Bob"
              required
            />
          </div>
          <div className="tutor_contact">
            <label htmlFor="tutor_contact">Tutor Contact*</label>
            <input
              type="text"
              id="tutor_contact"
              name="tutor_contact"
              value={formData.tutor_contact}
              onChange={handleInputChange}
              placeholder="91234567"
              required
            />
          </div>
          <div className="first_lesson_data_time">
            <label htmlFor="first_lesson_data_time">
              First Lesson Date & Time*
            </label>
            <input
              type="text"
              id="first_lesson_data_time"
              name="first_lesson_data_time"
              value={formData.first_lesson_data_time}
              onChange={handleInputChange}
              placeholder="Friday, 8th March, 7.15pm"
              required
            />
          </div>
          <div className="rate">
            <label htmlFor="rate">Rate*</label>
            <input
              type="text"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              placeholder="50"
              required
            />
          </div>
          <div className="frequency-duration">
            <label htmlFor="frequencyDuration">
              Frequency & Duration (Optional) "2 x 1.5hours/week"
            </label>
            <input
              type="text"
              id="frequencyDuration"
              name="frequencyDuration"
              value={formData.frequencyDuration}
              onChange={handleInputChange}
              placeholder="2 x 1.5hours/week"
            />
          </div>
          <div className="commission">
            <label htmlFor="commission">
              Number of Lessons of Commission (Optional)
            </label>
            <input
              type="text"
              id="commission"
              name="commission"
              value={formData.commission}
              onChange={handleInputChange}
              placeholder="3"
            />
          </div>
          <div className="commission-per-hour">
            <label htmlFor="commissionPerHour">
              Commission based on number of hours (OPTIONAL: Fill in ONLY if
              first lesson is different duration)
            </label>
            <input
              type="text"
              id="commissionPerHour"
              name="commissionPerHour"
              value={formData.commissionPerHour}
              onChange={handleInputChange}
              placeholder="2.5"
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
            cols="70"
            rows="30"
            value={textOutput1}
            onChange={(e) => {
              setIsCopy1(true);
              setTextOutput1(e.target.value);
            }}
          ></textarea>
          <button
            className="clipboard"
            onClick={() => {
              setIsCopy1(true);
              copyToClipboard(textOutput1);
            }}
          >
            Copy to Clipboard
          </button>
          {isCopy1 && <span>Copied</span>}
        </div>

        <div className="convert-output-title-2">
          <h3>Invoice Template</h3>
          <textarea
            name=""
            id=""
            cols="70"
            rows="30"
            value={textOutput2}
            onChange={(e) => setTextOutput2(e.target.value)}
          ></textarea>
          <button
            className="clipboard"
            onClick={() => {
              setIsCopy2(true);
              copyToClipboard(textOutput2);
            }}
          >
            Copy to Clipboard
          </button>
          {isCopy2 && <span>Copied</span>}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
