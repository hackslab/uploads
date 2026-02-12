require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 9000;
const URL = process.env.URL || "http://localhost";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Redirect back to the form with success or show a simple success page
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Success</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background-color: #f8f9fa;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background-color: white;
                padding: 2.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                text-align: center;
                width: 100%;
                max-width: 400px;
            }
            .icon {
                font-size: 3rem;
                color: #48bb78;
                margin-bottom: 1rem;
            }
            h2 {
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }
            p {
                color: #4a5568;
                margin-bottom: 1.5rem;
            }
            .btn {
                background-color: #4299e1;
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
                display: inline-block;
                transition: background-color 0.2s;
            }
            .btn:hover {
                background-color: #3182ce;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">✅</div>
            <h2>File Uploaded!</h2>
            <p>Your file <strong>${req.file.originalname}</strong> has been successfully uploaded.</p>
            <a href="/" class="btn">Upload Another File</a>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running at ${URL}:${PORT}`);
});
