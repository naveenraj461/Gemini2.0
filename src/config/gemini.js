import   { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
}   from   "@google/generative-ai"

const Model_NAME = "gemini-1.0-pro"; 
const API_KEY = "AIzaSyDDf2plBBBy0LKT6L6dxLxxyM7EyRIMp0U"; 

async function runchat(prompt) { 
  const genAI = new GoogleGenerativeAI(API_KEY); 
  const model = genAI.getGenerativeModel({ model: Model_NAME }); 

  const generationConfig = { 
    temperature: 0.9, 
    topK: 1, 
    topP: 1, 
    maxOutputTokens: 2048, 
  }; 

  const safetySettings = [ 
    { 
      category: HarmCategory.HARM_CATEGORY_HARASSMENT, 
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, 
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, 
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, 
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, 
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, 
    }, 
    { 
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, 
    }, 
  ]; 

  const chat = model.startChat({ 
    generationConfig, 
    safetySettings, 
    history: [], 
  }); 

  const result = await chat.sendMessage(prompt); 
  const response = result.response; 
  console.log(response.text()); 
  return response.text()
} 

export default runchat;
