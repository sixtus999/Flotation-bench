require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet: Adds security headers with CSP allowing external resources
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https:"
            ],
            connectSrc: [
                "'self'",
                "https://api.deepseek.com"
            ]
        }
    }
}));

// CORS: ONLY allow your domains to call this API
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // Add your Netlify URL here later (e.g., 'https://your-site.netlify.app')
        // Add your custom domain here later (e.g., 'https://flotationbench.com')
    ]
}));

// Rate Limiting: Max 50 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ============================================
// REGULAR MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));

// Serve static files (your HTML, CSS, JS)
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));

// ============================================
// CHAT ENDPOINT
// ============================================

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
                error: `API error: ${response.status}`
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
            error: 'Internal server error'
        });
    }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('🍒 Cherry AI Server running on http://localhost:' + PORT);
    console.log('   API endpoint: http://localhost:' + PORT + '/api/chat');
    console.log('   Your site: http://localhost:' + PORT);

    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.warn('\n⚠️  WARNING: "public" folder not found at: ' + PUBLIC_DIR);
        console.warn('   Create it and put your index.html inside — that\'s why you see "Cannot GET /".\n');
    } else if (!fs.existsSync(indexPath)) {
        console.warn('\n⚠️  WARNING: "public" folder exists but has no index.html at: ' + indexPath);
        console.warn('   Add index.html there — that\'s why you see "Cannot GET /".\n');
    } else {
        console.log('   ✅ Found public/index.html — site should load correctly.\n');
    }
});
