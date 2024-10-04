// Import required modules
const express = require('express');
const path = require('path');

// Create an Express app
const app = express();

// Define the port to 5502
const PORT = 5502;

// Serve static files from the current directory (where index.html, styles.css, etc. are located)
app.use(express.static(path.join(__dirname)));

// Route to handle any requests to the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server and listen on port 5502
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
