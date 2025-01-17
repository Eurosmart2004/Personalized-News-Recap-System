from models import User, News
from jinja2 import Environment, FileSystemLoader
from .sendEmail import send_email
from dotenv import load_dotenv
import os
load_dotenv()

# Get the absolute path to the directory of this script
dir_path = os.path.dirname(os.path.realpath(__file__))

# Get the absolute path to the templates directory
templates_path = os.path.join(dir_path, '../templates')

# Load the template
env = Environment(loader=FileSystemLoader(templates_path))
template = env.get_template('account_confirmation.html')

def send_email_confirmation(user: User, token: str):
    client_url = os.getenv('CLIENT_URL') if os.getenv('CLIENT_URL') else 'http://localhost:3000'
    url = client_url + f'/confirm/{token}'
    # Render the template with the news
    body = template.render(user=user, url=url)
    send_email(user, 'Email confirmation', body)