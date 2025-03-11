from CrawDag.crawling.Crawler import Crawler
from CrawDag.models import News
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import requests
import pytz
import html

class DanTriCrawler(Crawler):
    def __init__(self, topics: dict[str, str]) -> None:
        super().__init__(topics)


    def crawl(self) -> list[News]:
        news = []
        for topic in self.topics:
            response = requests.get(self.topics[topic], verify=False)
            soup = BeautifulSoup(response.content, 'xml')
            time = datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')) - timedelta(hours=24)
            for item in soup.find_all('item'):
                try:
                    link = item.find('link').text
                    link = html.unescape(link).strip()
                    pub_date_text = item.find('pubDate').text
                    try:
                        date = datetime.strptime(pub_date_text, '%a, %d %b %Y %H:%M:%S %z')
                    except ValueError:
                        try:
                            date = datetime.strptime(pub_date_text, '%a, %d %b %y %H:%M:%S %z')
                        except ValueError:
                            date = datetime.strptime(pub_date_text, '%a, %d %b %y %H:%M:%S %Z')

                    title = item.find('title').text.strip()
                    previous_title = ""
                    while title != previous_title:
                        previous_title = title
                        title = html.unescape(title)

                    title = self.clean_quotes(title)

                    description = item.find('description').text
                    description_soup = BeautifulSoup(description, 'html.parser')
                    img_tag = description_soup.find('img')
                    image = img_tag['src'] if img_tag else None
                    if date >= time and image:
                        news.append(News(topic=topic, title=title, link=link, date=date, image=image))
                except Exception as e:
                    print(e)
                    continue
        return news


    
