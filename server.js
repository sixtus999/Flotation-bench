require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files (your HTML, CSS, JS)
app.use(express.static('public'));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Cherry 🍒, a friendly AI assistant for FlotationBench – a flotation chemistry database for minerals and collectors.

Your role:
- Help users understand flotation chemistry, mineral-collector interactions, and surface chemistry concepts
- Explain HSAB theory, PZC, adsorption mechanisms, and flotation reagent selection
- Reference the data in FlotationBench where relevant (gibbsite, boehmite, hematite, quartz, kaolinite, chalcopyrite, etc.)
- Be concise, accurate, and helpful
- If you don't know something, say so honestly

You are embedded as a floating chat button on a flotation chemistry website. Keep responses clear and technically accurate but accessible to students and professionals.`
      },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: `API error: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ 
      reply,
      usage: data.usage
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve chat widget JS
app.get('/chat-widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-widget.js'), {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

app.listen(PORT, () => {
  console.log(`🍒 Cherry AI Server running on http://localhost:${PORT}`);
  console.log(`   API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`   Your site: http://localhost:${PORT}`);
});
