# Smart Signature Matching
 
Live demo: https://smart-signature-matching.netlify.app/
 
This is my Final Year Project. It is a signature verification system made for banks, where a cashier can check that the person at the counter is really the account holder (or someone authorized by them) before any transaction goes through.
 
The idea came from how cheques and withdrawal forms are still checked by eye in most branches. A cashier looks at the signature, compares it with the one on record and decides. That works most of the time, but it depends a lot on the person checking, and there is usually no proper record of how the decision was made. I wanted to put a few extra checks in that process and keep a log of every verification.
 
## How it works
 
The cashier goes through five steps for every verification:
 
1. Select the customer by searching their name.
2. Choose the document type (for example a cheque).
3. Verify the authorization slip by entering the Slip ID and CNIC. If the account owner is doing the transaction themselves, the cashier can skip this and proceed as account owner.
4. Upload the signature from the document.
5. An OTP is sent to the customer's Gmail and they have to enter it.
 
If the OTP is not received or entered, the transaction stops there. If it is correct, the system compares the uploaded signature with the customer's stored signature. The transaction only goes ahead if the match is above 70%. Whatever the result, the attempt is saved in the logs along with the cashier's name, customer details, date, time and the matching percentage.
 
Here is the full flow:
 
![Flowchart](screenshots/flowchart.png)
 
## Screenshots
 
Selecting a customer (step 1):
 
![Select Customer](screenshots/01-select-customer.png)
 
Authorization slip verification (step 3):
 
![Slip Verification](screenshots/02-slip-verification.png)
 
The screens below are from the prototype designs I made in my project proposal.
 
Login page:
 
![Login](screenshots/03-login.png)
 
Dashboard with branches, cashiers, customers and usage growth:
 
![Dashboard](screenshots/04-dashboard.png)
 
Branches page for the admin:
 
![Branches](screenshots/05-branches.png)
 
Logs page, where green entries passed and red entries failed:
 
![Logs](screenshots/06-logs.png)
 
Details of a single log, showing both signatures side by side with the matching percentage and customer details:
 
![Log Details](screenshots/07-log-details.png)
 
## Features
 
- Search customers by name
- Authorization slip check using Slip ID and CNIC
- Option to proceed without a slip when the account owner is present
- OTP verification through email
- Signature comparison with a 70% minimum match
- Logs of every verification, passed or failed
- Separate views for admin, manager and cashier
 
