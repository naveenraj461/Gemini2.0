import { createContext, useState } from "react";
import runchat from "../config/gemini";

// Create a context
export const Context = createContext();

// Context provider component
const ContextProvider = ({ children }) => {
  // State management
  const [input, setInput] = useState("");               // Current input from user
  const [recentPrompt, setRecentPrompt] = useState(""); // Last prompt sent
  const [prevPrompts, setPrevPrompts] = useState([]);   // Array of previous prompts
  const [showResult, setShowResult] = useState(false);  // Flag to show the result
  const [loading, setLoading] = useState(false);        // Flag to show loading state
  const [resultData, setResultData] = useState("");     // Final result text to show

  // Function to display the response gradually
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // Reset everything for a new chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setRecentPrompt("");
    setResultData("");
    // Optional: Reset previous prompts or keep them across sessions
    setPrevPrompts([]); 
  };

  // Function to handle sending the prompt and fetching the response
  const onSent = async (prompt) => {
    if (!prompt && !input) return; // Don't proceed if there's no input

    setResultData("");  // Clear any previous result data
    setLoading(true);   // Set loading state
    setShowResult(true); // Show result area

    try {
      const finalPrompt = prompt || input; // Use the provided prompt or the input
      const response = await runchat(finalPrompt); // Call the external API

      // Save the recent prompt and update the previous prompts array
      setRecentPrompt(finalPrompt);
      setPrevPrompts((prev) => [...prev, finalPrompt]);

      // Format the response (handle bold and line breaks)
      let formattedResponse = response
        .split("**")
        .map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text))
        .join("")
        .split("*")
        .join("</br>");

      // Convert the formatted response into an array of characters for gradual display
      let newResponseArray = formattedResponse.split("");

      // Gradually add characters to resultData
      newResponseArray.forEach((char, i) => delayPara(i, char));

    } catch (error) {
      console.error("Error fetching response:", error); // Log the error
      setResultData("An error occurred. Please try again."); // Show error message to user
    } finally {
      setLoading(false); // Set loading to false once the process is complete
      setInput(""); // Clear the input after submission
    }
  };

  // Context value to share across components
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  // Provide the context to children components
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
