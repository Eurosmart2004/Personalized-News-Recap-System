from CrawDag.crawling.Crawler import Crawler
from CrawDag.models import News
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
import pytz
import html

class ThanhNienCrawler(Crawler):
    def __init__(self, topics: dict[str: str]) -> None:
        super().__init__(topics)

    def crawl(self) -> list[News]:
        news = []
        for topic in self.topics:
            response = requests.get(self.topics[topic], verify=False)
            soup = BeautifulSoup(response.content, 'xml')
            time = datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')) - timedelta(hours=24)
            for item in soup.find_all('item'):
                link = item.find('link').text
                pub_date_text = item.find('pubDate').text
                date = datetime.strptime(pub_date_text, '%a, %d %b %y %H:%M:%S %z')                
                title = item.find('title').text.strip()
                title = html.unescape(title)
                description = item.find('description').text
                description = description[9:-3]
                description_soup = BeautifulSoup(description, 'html.parser')
                img_tag = description_soup.find('img')
                image = img_tag['src'] if img_tag else None
                if date >= time:
                    news.append(News(topic=topic, title=title, link=link, date=date, image=image))
        return news


    
