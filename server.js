
 
// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const cache = new NodeCache();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200); // Preflight request response
    } else {
        next();
    }
});

// Rate limiter middleware to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Hold on there, maybe get a life instead of spamming my API.",
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aman@123',
    database: 'socialmedia',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Create 'posts' table if not exists
db.query(`CREATE TABLE IF NOT EXISTS posts(
  id INT PRIMARY KEY,
  textContent TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Error creating posts table:', err);
    }
});

// POST endpoint to create a new post
app.post('/api/v1/posts', (req, res) => {
    const {
        id,
        textContent
    } = req.body;
    const sql = 'INSERT INTO posts (id, textContent) VALUES (?, ?)';

    // Check if the SQL query is not empty
    if (!sql.trim()) {
        console.warn('Empty SQL query. Skipping database insertion.');
        res.status(400).json({
            error: 'Bad Request'
        });
    } else {
        // Execute the SQL query
        db.query(sql, [id, textContent], (err, results) => {
            if (err) {
                console.error('Error creating post:', err);
                res.status(500).json({
                    error: 'Internal Server Error'
                });
            } else {
                res.status(201).json({
                    id,
                    textContent
                });
            }
        });
    }
});

// GET endpoint for post analysis
app.get('/api/v1/posts/:id/analysis', (req, res) => {
    const postId = req.params.id;
    const cacheKey = `postAnalysis_${postId}`;

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log("hello this is cached");
        res.status(200).json(cachedData);
    } else {
        const sql = 'SELECT * FROM posts WHERE id = ?';

        db.query(sql, [postId], (err, results) => {
            if (err) {
                console.error('Error retrieving post:', err);
                res.status(500).json({
                    error: 'Internal Server Error'
                });
            } else if (results.length === 0) {
                res.status(404).json({
                    error: 'Post not found'
                });
            } else {
                const post = results[0];
                const words = post.textContent.split(' ');
                const wordCount = words.length;
                const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
                const averageWordLength = totalWordLength / wordCount;

                const analysisResult = {
                    wordCount,
                    averageWordLength
                };

                // Cache the result for future requests
                cache.set(cacheKey, analysisResult, 15 * 60); // Cache for 15 minutes

                res.status(200).json(analysisResult);
            }
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const rateLimit = require('express-rate-limit');
// const NodeCache = require('node-cache');
// const {
//     Worker
// } = require('worker_threads');
// const cache = new NodeCache();

// const app = express();
// const PORT = process.env.PORT || 3001; // Or any other available port


// app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     message: "Hold on there, maybe get a life instead of spamming my API.",
//     max: 100,
// });
// app.use(limiter);

// // Database connection setup with multiple hosts for sharding
// const dbShards = [
//     mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Aman@123',
//         database: 'socialmedia_shard1', // Change the database name for each shard
//     }),
//     // Add more shards as needed
// ];


// function getShard(postId) {
//     const shardCount = dbShards.length;
//     const shardIndex = postId % shardCount;
//     return dbShards[shardIndex];
// }

// // Create 'posts' table if not exists for each shard
// dbShards.forEach((shard, index) => {
//     shard.query(`CREATE TABLE IF NOT EXISTS posts(
//     id INT PRIMARY KEY,
//     textContent TEXT NOT NULL
//   )`, (err) => {
//         if (err) {
//             console.error(`Error creating posts table for shard ${index}:`, err);
//         }
//     });
// });

// app.post('/api/v1/posts', (req, res) => {
//     const {
//         id,
//         textContent
//     } = req.body;
//     const shard = getShard(id);
//     const sql = 'INSERT INTO posts (id, textContent) VALUES (?, ?)';

//     if (!sql.trim()) {
//         console.warn('Empty SQL query. Skipping database insertion.');
//         res.status(400).json({
//             error: 'Bad Request'
//         });
//     } else {
//         shard.query(sql, [id, textContent], (err, results) => {
//             if (err) {
//                 console.error(`Error creating post on shard ${shard}:`, err);
//                 res.status(500).json({
//                     error: 'Internal Server Error'
//                 });
//             } else {
//                 res.status(201).json({
//                     id,
//                     textContent
//                 });
//             }
//         });
//     }
// });

// app.get('/api/v1/posts/:id/analysis', (req, res) => {
//     const postId = req.params.id;
//     const shard = getShard(postId);
//     const cacheKey = `postAnalysis_${postId}`;

//     const cachedData = cache.get(cacheKey);

//     if (cachedData) {
//         console.log("hello this is cached");
//         res.status(200).json(cachedData);
//     } else {
//         const sql = 'SELECT * FROM posts WHERE id = ?';

//         shard.query(sql, [postId], (err, results) => {
//             if (err) {
//                 console.error(`Error retrieving post on shard ${shard}:`, err);
//                 res.status(500).json({
//                     error: 'Internal Server Error'
//                 });
//             } else if (results.length === 0) {
//                 res.status(404).json({
//                     error: 'Post not found'
//                 });
//             } else {
//                 const post = results[0];
//                 // Perform analysis computation in a worker thread
//                 performAnalysisInWorker(post.textContent, (analysisError, analysisResult) => {
//                     if (analysisError) {
//                         console.error('Error performing analysis:', analysisError);
//                         res.status(500).json({
//                             error: 'Internal Server Error'
//                         });
//                     } else {
//                         // Cache the result for future requests
//                         cache.set(cacheKey, analysisResult, 15 * 60); // Cache for 15 minutes
//                         res.status(200).json(analysisResult);
//                     }
//                 });
//             }
//         });
//     }
// });

// // Function to perform analysis computation in a worker thread
// function performAnalysisInWorker(postContent, callback) {
//     const worker = new Worker('./analysis-worker.js', {
//         workerData: postContent
//     });
//     worker.on('message', (result) => {
//         callback(null, result);
//     });
//     worker.on('error', (error) => {
//         callback(error);
//     });
//     worker.on('exit', (code) => {
//         if (code !== 0) {
//             callback(new Error(`Worker stopped with exit code ${code}`));
//         }
//     });
// }

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
