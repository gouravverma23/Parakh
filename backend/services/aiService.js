const axios = require("axios");
const FormData = require("form-data");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:3000";
const AI_EVALUATION_SERVICE_URL = process.env.AI_EVALUATION_SERVICE_URL || "http://localhost:8000";

/**
 * Sends formData to the Question Paper parsing server and gets the response.
 * Returns the exact JSON response from the AI service without any modification.
 *
 * @returns {Object} The parsed question paper JSON (exact format from AI service)
 */
const parseQuestionPaper = async (files) => {
  const formData = new FormData();
  //formData contains key, buffer of file, file header or normal string containing fileName.
  
  files.forEach((file)=>{
    formData.append("QP",file.buffer,
      {
        filename: file.originalname,
        contentType: file.mimetype,
      }
    )
  });
  

  const response = await axios.post(
    `${AI_SERVICE_URL}/ai/parse-question-paper`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 600000, // 5 minutes timeout for AI processing
    }
  );

  // Return the exact JSON response — no transformation
  return response.data;
};

/**
 * Sends the student answer sheet PDF and the question paper JSON to the FastAPI AI service at port 8000.
 *
 * @param {Buffer} answerPdfBuffer - The buffer of the uploaded student answer sheet
 * @param {string} answerPdfName - The filename of the answer sheet
 * @param {string} answerPdfMimeType - The mime type of the answer sheet
 * @param {Object} questionJsonData - The question paper JSON retrieved from database
 * @returns {Object} The evaluated grading JSON response from the AI service
 */
const evaluateAnswers = async (answerPdfBuffer, answerPdfName, answerPdfMimeType, questionJsonData) => {
  const formData = new FormData();

  formData.append("answer_pdf", answerPdfBuffer, {
    filename: answerPdfName,
    contentType: answerPdfMimeType,
  });

  const questionJsonBuffer = Buffer.from(JSON.stringify(questionJsonData));
  formData.append("question_json", questionJsonBuffer, {
    filename: "question_paper.json",
    contentType: "application/json",
  });

  const response = await axios.post(
    `${AI_EVALUATION_SERVICE_URL}/ai/evaluate-answers`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 600000, // 5 minutes timeout for AI processing
    }
  );

  return response.data;
};

module.exports = {
  parseQuestionPaper,
  evaluateAnswers,
};


