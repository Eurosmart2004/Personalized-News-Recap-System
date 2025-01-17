from models import User
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
import os
from dotenv import load_dotenv
load_dotenv()

def send_email(user: User, subject: str, body: str):
    with smtplib.SMTP(os.getenv('SMTP_HOST'), int(os.getenv('SMTP_PORT'))) as server:
        server.starttls()
        server.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASS'))
        # Create the email
        message = MIMEMultipart()
        message['From'] = os.getenv('SMTP_USER')
        message['Subject'] = subject
        message.attach(MIMEText(body, 'html'))
        message['To'] = user.email
        server.sendmail(os.getenv('SMTP_USER'), user.email, message.as_string())

    return("Email sent successfully!")
