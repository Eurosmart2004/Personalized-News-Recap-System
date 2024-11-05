from bs4 import BeautifulSoup
import requests
from CrawDag.models import News
from newspaper import Article

def clean_content(text: str) -> str:
    """Helper function to clean article content."""
    return text.strip().replace("\n", " ").replace("\t", " ")

def scrape_basic_article(news: News):
    response = requests.get(news.link, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    paragraphs = soup.find_all('p')
    content = ' '.join([para.get_text() for para in paragraphs[0:-1]])
    html = soup.find('article')
    news.content = clean_content(content)
    news.html = html

def scrape_news_v2(news: News):
    article = Article(news.link)
    article.download()
    article.parse()
    paragraphs = article.text.split('\n')
    news.content = '\n'.join([para for para in paragraphs[0:-1]]).strip()
    news.html = article.html