const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const handleChat = async (req, res) => {
  try {
    if (!groq) {
      return res.status(500).json({ error: 'Groq API Key is not configured on the server.' });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemPrompt = {
      role: 'system',
      content: 'You are Sage, an AI Expert on the War Economic Impact Dataset. You assist users in understanding the economic impact of various global conflicts, including inflation, GDP changes, poverty, infrastructure damage, and reconstruction costs. Answer concisely and professionally, focusing on data-driven insights when applicable. Be polite and helpful. If you do not know the answer, state so clearly.'
    };

    // Prepend the system prompt to the messages
    const chatMessages = [systemPrompt, ...messages];

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
    });

    const responseContent = completion.choices[0]?.message?.content;

    res.status(200).json({
      success: true,
      data: {
        role: 'assistant',
        content: responseContent
      }
    });

  } catch (error) {
    console.error('Groq Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
};

module.exports = {
  handleChat
};
