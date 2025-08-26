const mongoose = require('mongoose');

// 1. --- IMPORTANT ---
// Make sure to replace this with your actual MongoDB connection string.
const mongoURI = 'mongodb+srv://nishadphule:admin@cluster0.hrw34si.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// 2. Define the same schemas as in your server.js
const postSchema = new mongoose.Schema({
    id: Number,
    category: String,
    categoryColor: String, // e.g., 'bg-orange-100 text-orange-800'
    title: String,
    date: String,
    readTime: String,
    excerpt: String,
    content: String, // Full HTML content for the post body
});

const tweetSchema = new mongoose.Schema({
    text: String,
    userHandle: String,
    userLink: String,
});

// 3. Create Models
const Post = mongoose.model('Post', postSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

// 4. Define the data to be inserted
const postsToSeed = [
    {
        id: 1,
        category: 'Finance',
        categoryColor: 'bg-orange-100 text-orange-800',
        title: 'Understanding Government Bonds: A Safe Haven for Investors',
        date: '18 Aug 2025',
        readTime: '6 MIN READ',
        excerpt: 'A deep dive into why government bonds are considered a secure investment and how they work.',
        content: `
            <h3>What Are Government Bonds?</h3>
            <p>Government bonds are essentially loans that you make to the government. In return for your investment, the government promises to pay you periodic interest payments, known as coupons, and to repay the principal amount at the end of the bond's term. They are considered one of the safest investments available, as they are backed by the full faith and credit of the government.</p>
            <p>This inherent security makes them a cornerstone of conservative investment portfolios, particularly for those nearing retirement or with a low tolerance for risk. Unlike corporate bonds, the likelihood of a government defaulting on its debt is extremely low, especially for stable, developed nations.</p>
            <h3>Benefits and Risks</h3>
            <p>The primary benefit of government bonds is their safety and predictability. They provide a steady stream of income and are less volatile than stocks. However, they are not without risks. Inflation can erode the value of your returns, and changes in interest rates can affect the market price of your bonds if you decide to sell them before maturity. We'll explore these factors in detail to help you make an informed decision.</p>
            <h3>Types of Government Bonds</h3>
            <p>There are several types of government bonds, each with different maturities and features. Treasury bills (T-bills) are short-term bonds with maturities of one year or less. Treasury notes (T-notes) have maturities ranging from two to ten years, while Treasury bonds (T-bonds) have the longest maturities, typically 20 to 30 years. Understanding the differences between these instruments is key to building a balanced bond portfolio.</p>
        `
    },
];

const tweetsToSeed = [
    {
        text: 'I think US $TLT is bottoming out at $86 - $87. If FED cuts in September these might go to $100. But who knows FED. Everybody thinks FED will cut rates but  you see what happened with UK30Y. Inflation is not and was never transitory',
        userHandle: '@nishad_phule',
        userLink: 'https://twitter.com/nishad_phule'
    },
];


// 5. The seeding function
const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Successfully connected to MongoDB for seeding!');

        // Clear existing data
        await Post.deleteMany({});
        await Tweet.deleteMany({});
        console.log('Cleared existing posts and tweets.');

        // Insert new data
        await Post.insertMany(postsToSeed);
        await Tweet.insertMany(tweetsToSeed);
        console.log('Database has been successfully seeded!');

    } catch (err) {
        console.error('Failed to seed database:', err);
    } finally {
        // Close the connection
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};
seedDB();