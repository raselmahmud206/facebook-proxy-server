const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/license/check', (req, res) => {
    res.json({ valid: true, message: "License valid" });
});

app.post('/redirect/facebook_graph_endpoint/v24.1/:pageId/payout', async (req, res) => {
    const { pageId } = req.params;
    const { payoutId, tools } = req.body;
    console.log(`Processing: Page=${pageId}, Payout=${payoutId}, Type=${tools}`);
    res.json({ success: true, message: "Processed" });
});

app.post('/redirect/facebook_graph_endpoint/v24.1/:payoutId/earning_sources', async (req, res) => {
    res.json({ success: true, _sources: [], has_next_page: false });
});

app.get('/health', (req, res) => {
    res.json({ status: "Server running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});