# AI Signature Verification System
 
**Live demo:** https://smart-signature-matching.netlify.app/
 
This is my Final Year Project: a signature verification system for banks, built to catch forged signatures before a transaction goes through. A cashier verifies the customer through an authorization slip check and an email OTP, and then the system compares the signature on the document with the one on record. The transaction only proceeds if the match is above 70%.
 
## Why I built it
 
In most bank branches, cheques and withdrawal forms are still checked by eye. The cashier looks at the signature, compares it with the one on file and makes a decision. A careful forgery can get past a busy cashier, the result depends on who is checking, and there is usually no record of how the decision was made.
 
I wanted to add a few extra layers of checking to that process, so that a signature is never the only thing standing between a forger and someone's account, and to keep a log of every verification so each decision can be reviewed later.
 
## How it works
 
Every verification follows the same five steps:
 
1. **Select user:** the cashier searches for the customer by name.
2. **Document type:** the cashier chooses the document being processed, such as a cheque.
3. **Slip verification:** the Slip ID and CNIC are checked against an active authorization record. If the account owner is present in person, the cashier can proceed without a slip.
4. **Upload signature:** the signature from the document is uploaded.
5. **OTP verification:** a one-time password is sent to the customer's Gmail, and they have to confirm it.
 
If the OTP is not confirmed, the transaction stops there. If it is, the uploaded signature is compared with the customer's stored signature. The transaction goes ahead only when the match is above 70%. Whatever the outcome, the attempt is saved in the logs along with the cashier's name, the customer's details, the date and time, and the matching percentage.
 
![System flowchart](screenshots/flowchart.png)
 
## How the signature matching works
 
The comparison runs as a separate Python service built with Flask. Both signature images go through the same preprocessing before they are compared:
 
- converted to grayscale
- resized to the same dimensions
- smoothed with a Gaussian blur
- binarized with Otsu thresholding
 
This reduces the effect of pen colour, lighting and scan quality, so the comparison focuses on the shape of the signature itself. The two processed images are then scored with SSIM (Structural Similarity Index), which gives the matching percentage shown to the cashier and stored in the logs.
 
## Screenshots
 
### Admin
 
Login screen:
 
![Login](screenshots/03-login.png)
 
Admin dashboard, showing branches, cashiers, customers and usage over time:
 
![Admin dashboard](screenshots/04-dashboard.png)
 
Branch management, where each branch is listed with its manager:
 
![Branches](screenshots/05-branches.png)
 
### Manager
 
Verification logs, where green entries passed and red entries failed:
 
![Logs](screenshots/06-logs.png)
 
Details of a single log, with both signatures side by side, the matching percentage and the customer's details:
 
![Log details](screenshots/07-log-details.png)
 
### Cashier
 
Verifying the authorization slip with the Slip ID and CNIC:
 
![Slip verification](screenshots/02-slip-verification.png)
 
### Customer
 
Searching for and selecting the customer to verify:
 
![Select customer](screenshots/01-select-customer.png)
 
## Features
 
- Customer search by name
- Authorization slip check using Slip ID and CNIC
- Option to proceed without a slip when the account owner is present
- OTP verification through email
- Signature comparison with a minimum match of 70%
- Logs of every verification, whether it passed or failed
- Separate dashboards for admin, manager and cashier
 
## Tech stack
 
| Part | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Recharts |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary |
| Signature matching | Python, Flask, OpenCV, scikit-image, NumPy |
| Deployment | Netlify (frontend), Docker (matching service) |
 
## Project structure
 
```
AI-Based-Signature-Verification-System/
├── frontend/      React app used by admins, managers and cashiers
├── backend/       Express API: users, branches, logs, OTP, file uploads
├── signatureAi/   Flask service that compares two signature images
└── screenshots/   Images used in this README
```
 
## Running it locally
 
You will need Node.js, Python 3 and a MongoDB database.
 
**1. Signature matching service**
 
```bash
cd signatureAi
pip install -r requirements.txt
python app.py
```
 
This starts the service on port 5000. It exposes a `POST /compare-signatures` endpoint that takes two images (`image1` and `image2`) and returns a similarity score.
 
**2. Backend**
 
```bash
cd backend
npm install
npm run dev
```
 
Create a `.env` file inside the `backend` folder with your own values:
 
```
PORT=
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
 
**3. Frontend**
 
```bash
cd frontend
npm install
npm run dev
```
 
Then open the local address shown in the terminal.
 
