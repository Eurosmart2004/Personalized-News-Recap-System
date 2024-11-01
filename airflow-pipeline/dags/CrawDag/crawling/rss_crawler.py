import requests
from bs4 import BeautifulSoup
from CrawDag.models import News
from datetime import datetime, timedelta
import pytz
import html

def crawl_rss(topic, url) -> list[News]:
    """Crawl articles from RSS feeds."""
    response = requests.get(url, verify=False)
    soup = BeautifulSoup(response.content, 'xml')
    now = datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
    time = now - timedelta(days=1)
    news = []
    for item in soup.find_all('item'):
        link = item.find('link').text
        pub_date_text = item.find('pubDate').text
        try:
            date = datetime.strptime(pub_date_text, '%a, %d %b %Y %H:%M:%S %z')
        except ValueError:
            date = datetime.strptime(pub_date_text, '%a, %d %b %y %H:%M:%S %z')
        title = item.find('title').text.strip()
        if title.startswith('<![CDATA[') and title.endswith(']]>'):
            title = title[9:-3]  # Remove CDATA tags
        title = html.unescape(title)  # Decode HTML entities

        # image = item.find('enclosure').get('url') if item.find('enclosure') else 'No image'

        description = item.find('description').text
        if description.startswith('<![CDATA[') and description.endswith(']]>'):
            description = description[9:-3]  # Remove CDATA tags
        description_soup = BeautifulSoup(description, 'html.parser')
        img_tag = description_soup.find('img')
        image = img_tag['src'] if img_tag else 'No image'

        if date >= time:
            news.append(News(topic=topic ,title=title, link=link, date=date, image=image))
    return news