const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============= GET ENDPOINTS =============

// Home route - ব্রাউজারে খুললে দেখাবে
app.get('/', (req, res) => {
    res.json({ 
        status: "active", 
        message: "Facebook Proxy Server is running successfully!",
        timestamp: new Date().toISOString(),
        endpoints: {
            home: "GET /",
            health: "GET /health",
            license: "POST /api/license/check",
            payout: "POST /redirect/facebook_graph_endpoint/v24.1/:pageId/payout",
            earning_sources: "POST /redirect/facebook_graph_endpoint/v24.1/:payoutId/earning_sources"
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// ============= POST ENDPOINTS =============

// License check endpoint (always returns valid)
app.post('/api/license/check', (req, res) => {
    const { license, version } = req.body;
    console.log(`📋 License check: ${license}, Version: ${version}`);
    
    res.json({ 
        valid: true, 
        message: "License valid",
        timestamp: Date.now()
    });
});

// Payout endpoint - ফেসবুক পেইজে পেমেন্ট প্রসেস করার জন্য
app.post('/redirect/facebook_graph_endpoint/v24.1/:pageId/payout', async (req, res) => {
    const { pageId } = req.params;
    const { payoutId, tools, license } = req.body;
    
    console.log(`🎯 Processing payout:`);
    console.log(`   Page ID: ${pageId}`);
    console.log(`   Payout ID: ${payoutId}`);
    console.log(`   Tools/Subtype: ${tools}`);
    console.log(`   License: ${license}`);
    
    // সিমুলেটেড রেসপন্স (আসল ফেসবুক API কল পরবর্তী ধাপে)
    res.json({ 
        success: true, 
        message: "Payout processed successfully",
        data: {
            pageId: pageId,
            payoutId: payoutId,
            tools: tools,
            status: "completed",
            timestamp: Date.now()
        }
    });
});

// Earning sources endpoint - লিংকেড পেমেন্ট সোর্স চেক করার জন্য
app.post('/redirect/facebook_graph_endpoint/v24.1/:payoutId/earning_sources', async (req, res) => {
    const { payoutId } = req.params;
    const { license, cursor, after } = req.body;
    
    console.log(`📊 Checking earning sources for payout: ${payoutId}`);
    console.log(`   Cursor: ${cursor}, After: ${after}`);
    
    res.json({
        success: true,
        _sources: [],
        has_next_page: false,
        cursor: null,
        after: 0,
        timestamp: Date.now()
    });
});

// ============= FALLBACK =============

// কোন ম্যাচ না পাওয়া গেলে 404
app.use((req, res) => {
    res.status(404).json({ 
        error: "Endpoint not found",
        message: `Cannot ${req.method} ${req.url}`,
        availableEndpoints: {
            "GET /": "Home page",
            "GET /health": "Health check",
            "POST /api/license/check": "License validation",
            "POST /redirect/facebook_graph_endpoint/v24.1/:pageId/payout": "Process payout",
            "POST /redirect/facebook_graph_endpoint/v24.1/:payoutId/earning_sources": "Check earning sources"
        }
    });
});

// ============= START SERVER =============

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`✅ Facebook Proxy Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`========================================`);
});
