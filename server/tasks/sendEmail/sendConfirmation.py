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
template = env.get_template('templates/account_confirmation.html')

def send_email_confirmation(user: User):
    # Render the template with the news
    body = template.render(user=user)
    send_email(user, 'Xác nhận email', body)
