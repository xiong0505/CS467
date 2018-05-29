CS467-ONLINE CAPSTONE PROJECT
WEB3: EMPLOYEE RECONGNITION
GROUP: PHOENIX
MEMBER:
Nina Lauritzen
Eric Walters
Junyi Xiong


OS: window 10

Week3-4: Javascript + LaTeX --> PDF
1. Download Node.js and install it
2. Create a GitHub Repository name CS467, and clone it to local. Inside Folder CS467
   WEB3 Directory   C:\Users\junyi\Documents\GitHub\CS467
3. Download LaTeX from MikTexL: https://miktex.org/download
   LaTex Directory   C:\Users\junyi\AppData\Local\Programs\MiKTeX 2.9
4. Inside folder CS467: README.md , signature.png , latex.js , Awardtest.tex
to do: pdflatex generates a lot of intermediate files xx.aux, xx.fls e.g, think of a way to get rid of it.


Week4-5:Note.js Email + clean up the directory
edittor recommendation from Peng that is easy and light-load:visual studio code
1.Sign up for gmail account: 
 PheonixWeb3@gmail.com   12345678.p
2.Major instruction: https://www.w3schools.com/nodejs/nodejs_email.asp
3.npm install nodemailer for sending out email
4.npm install node-uuid for clean up the directory
5.npm install rimraf for clean up the directory


Week5-6:
1.Edit sendMail.js to accept variables
2.Creat sendMailWithoutAttachment.js which accept variables but no attachemnt : Nina's finding password through email
3. Edit Latex to allow it to accept variables, and then generate a Awardtest.tex file that can be used to transfered into pdf

Mid-Point Check Week:
There are some problems with installing latex into Amazon EC2 and Digital Ocean Ubuntu. 
I tried to get into the EC2 instance, and tried to install on Amazon EC2, and was not successful.
And then I tried to intall into Ubuntu, and I found there are some other issues with it. So I let it go.

Week 8: Generate PDF with Node.js directly
1. npm install pdfkit







