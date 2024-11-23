from models import User, News
from jinja2 import Environment, FileSystemLoader
from .sendEmail import send_email
from dotenv import load_dotenv
import os
load_dotenv()

# Get the absolute path to the directory of this script
dir_path = os.path.dirname(os.path.realpath(__file__))

# Load the template
env = Environment(loader=FileSystemLoader(dir_path))
template = env.get_template('templates/forgot_password.html')

def send_email_forgot_password(user: User, token: str):
    client_url = os.getenv('CLIENT_URL') if os.getenv('CLIENT_URL') else 'http://localhost:3000'
    url = client_url + f'/reset-password/{token}'
    # Render the template with the news
    body = template.render(url=url)
    send_email(user, 'Reset password', body)
