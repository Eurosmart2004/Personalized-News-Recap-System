import sys
import os
# Add the project root to the sys.path to allow module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import unittest
from scraping.ScrapeMethod.ScrapeArticle import *
from crawling.RssCrawler import *
from models import News
from datetime import datetime, timedelta
import pytz

sources = [
    {
        'source': 'thanhnien',
        'type': 'rss',
        'topic': {
            'economic': 'https://thanhnien.vn/rss/kinh-te.rss',
        },
    },
    {
        'source': 'vnexpress',
        'type': 'rss',
        'topic': {
            'economic': 'https://vnexpress.net/rss/kinh-doanh.rss',
        },
    },
    {
        'source': 'dantri',
        'type': 'rss',
        'topic': {
            'economic': 'https://dantri.com.vn/rss/kinh-doanh.rss',
        },
    },
    {
        'source': 'baotintuc',
        'type': 'rss',
        'topic': {
            'economic': 'https://baotintuc.vn/kinh-te.rss',
        }
    },
    {
        'source': 'vietnamnet',
        'type': 'rss',
        'topic': {
            'economic': 'https://vietnamnet.vn/rss/kinh-doanh.rss',
        }
    }
]


class TestScraping(unittest.TestCase):
    def test_scrape_article(self):

        news: list[News] = []
        for source in sources:
            if source['source'] == 'vnexpress':
                crawler = VnexpressCrawler(source['topic'])
            elif source['source'] == 'thanhnien':
                crawler = ThanhNienCrawler(source['topic'])
            elif source['source'] == 'dantri':
                crawler = DanTriCrawler(source['topic'])
            elif source['source'] == 'baotintuc':
                crawler = BaoTinTucCrawler(source['topic'])
            elif source['source'] == 'vietnamnet':
                crawler = VietnamnetCrawler(source['topic'])
            news.append(crawler.crawl()[0])

        scrapeArticle = ScrapeArticle(news)
        newsList = scrapeArticle.scrape()

        for n in newsList:
            self.assertNotEquals(len(n.content), 0)
            self.assertGreater(len(n.content), 10)

            print(n.title)
            print(n.content)
            print('-------------------')


