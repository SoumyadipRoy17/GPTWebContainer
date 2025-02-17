import * as ai from "../services/ai.service.js";

export const generateResult = async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const result = await ai.generateResult(prompt);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in generateResult:", error.message);
    res.status(500).json({ error: error.message });
  }
};
