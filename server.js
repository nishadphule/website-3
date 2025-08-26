// server.js - Your full-stack backend server

// 1. Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const yahooFinance = require('yahoo-finance2').default;
require('dotenv').config();

// 2. Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware
app.use(cors());
app.use(express.json());
// --- UPDATED: Serve static files from the root directory ---
app.use(express.static(__dirname));

// 4. Connect to MongoDB
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Connection error:', err));

// 5. Define Data Schemas
const postSchema = new mongoose.Schema({
    id: Number,
    category: String,
    categoryColor: String,
    title: String,
    date: String,
    readTime: String,
    excerpt: String,
    content: String,
});

const tweetSchema = new mongoose.Schema({
    text: String,
    userHandle: String,
    userLink: String,
});

// 6. Create Models
const Post = mongoose.model('Post', postSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

// 7. Page-serving Endpoints
// --- UPDATED: Serve HTML files from the root directory ---

// Root route serves your main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Route for the about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Route for the articles page
app.get('/articles', (req, res) => {
    res.sendFile(path.join(__dirname, 'articles.html'));
});

// Route for a single post page
// Note: This assumes you have a generic post.html that will fetch specific post data.
app.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'post.html'));
});


// 8. API Endpoints

// Get all blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send('Error fetching posts');
    }
});

// Get a single post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ id: req.params.id });
        if (post) res.json(post);
        else res.status(404).send('Post not found');
    } catch (error) {
        res.status(500).send('Error fetching post');
    }
});

// Get all tweets
app.get('/api/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find();
        res.json(tweets);
    } catch (error) {
        res.status(500).send('Error fetching tweets');
    }
});

// Endpoint to get live ticker data
app.get('/api/ticker', async (req, res) => {
    const symbols = [
        '^DJI', '^IXIC', '^NSEI', '^BSESN', 
        '^N225', '^FCHI', '^GDAXI',       
        'GC=F', 'SI=F',
        'DX-Y.NYB'
    ];
    
    const symbolDetails = {
        '^DJI': { name: 'DJIA', link: 'https://finance.yahoo.com/quote/%5EDJI' },
        '^IXIC': { name: 'NASDAQ', link: 'https://finance.yahoo.com/quote/%5EIXIC' },
        '^NSEI': { name: 'Nifty 50', link: 'https://finance.yahoo.com/quote/%5ENSEI' },
        '^BSESN': { name: 'Sensex', link: 'https://finance.yahoo.com/quote/%5EBSESN' },
        '^N225': { name: 'Nikkei 225', link: 'https://finance.yahoo.com/quote/%5EN225' },
        '^FCHI': { name: 'CAC 40', link: 'https://finance.yahoo.com/quote/%5EFCHI' },
        '^GDAXI': { name: 'DAX', link: 'https://finance.yahoo.com/quote/%5EGDAXI' },
        'GC=F': { name: 'Gold', link: 'https://finance.yahoo.com/quote/GC=F' },
        'SI=F': { name: 'Silver', link: 'https://finance.yahoo.com/quote/SI=F' },
        'DX-Y.NYB': { name: 'DXY 💵', link: 'https://finance.yahoo.com/quote/DX-Y.NYB' }
    };

    try {
        const results = await yahooFinance.quote(symbols);
        
        const formattedData = results.map(quote => {
            const change = quote.regularMarketChange.toFixed(2);
            const isUp = change >= 0;
            
            return {
                name: symbolDetails[quote.symbol]?.name || quote.shortName || quote.symbol,
                value: quote.regularMarketPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: `${isUp ? '+' : ''}${change}`,
                direction: isUp ? 'up' : 'down',
                link: symbolDetails[quote.symbol]?.link || `https://finance.yahoo.com/quote/${quote.symbol}`
            };
        });
        
        res.json(formattedData);
    } catch (error) {
        console.error('Yahoo Finance API error:', error);
        res.status(500).json({ message: 'Error fetching ticker data', error: error.message });
    }
});


// 9. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
