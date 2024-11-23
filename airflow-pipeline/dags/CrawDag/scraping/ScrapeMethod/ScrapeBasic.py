from CrawDag.scraping.Scraper import Scraper
from CrawDag.models import News
from bs4 import BeautifulSoup
import requests

class ScrapeBasic(Scraper):
    def __init__(self, listNews: list[News]) -> None:
        self.listNews = listNews

    def scrape(self) -> list[News]:
        newsList: list[News] = []
        for news in self.listNews:
            response = requests.get(news.link, verify=False)
            soup = BeautifulSoup(response.content, 'html.parser')
            paragraphs = soup.find_all('p')
            content = ' '.join([para.get_text() for para in paragraphs[0:-1]])
            html = soup.find('article')
            news.content = content.strip()
            news.html = html
            newsList.append(news)

        return newsList
        