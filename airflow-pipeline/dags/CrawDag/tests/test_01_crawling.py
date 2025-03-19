import sys
import os
# Add the project root to the sys.path to allow module imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import unittest
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
            'health': 'https://thanhnien.vn/rss/suc-khoe.rss',
            'sport': 'https://thanhnien.vn/rss/the-thao.rss',
            'politic': 'https://thanhnien.vn/rss/chinh-tri.rss',
            'technology': 'https://thanhnien.vn/rss/cong-nghe.rss',
            'car': 'https://thanhnien.vn/rss/xe.rss',
            'news': 'https://thanhnien.vn/rss/thoi-su.rss',
        },
    },
    {
        'source': 'vnexpress',
        'type': 'rss',
        'topic': {
            'economic': 'https://vnexpress.net/rss/kinh-doanh.rss',
            'health': 'https://vnexpress.net/rss/suc-khoe.rss',
            'sport': 'https://vnexpress.net/rss/the-thao.rss',
            'politic': 'https://vnexpress.net/rss/the-gioi.rss',
            'technology': 'https://vnexpress.net/rss/cong-nghe.rss',
            'car': 'https://vnexpress.net/rss/xe.rss',
            'news': 'https://vnexpress.net/rss/thoi-su.rss',
        },
    },
    {
        'source': 'dantri',
        'type': 'rss',
        'topic': {
            'economic': 'https://dantri.com.vn/rss/kinh-doanh.rss',
            'health': 'https://dantri.com.vn/rss/suc-khoe.rss',
            'sport': 'https://dantri.com.vn/rss/the-thao.rss',
            'politic': 'https://dantri.com.vn/rss//the-gioi.rss',
            'technology': 'https://dantri.com.vn/rss/cong-nghe.rss',
            'car': 'https://dantri.com.vn/rss/o-to-xe-may.rss',
            'news': 'https://dantri.com.vn/rss/xa-hoi.rss',
        },
    },
    {
        'source': 'baotintuc',
        'type': 'rss',
        'topic': {
            'economic': 'https://baotintuc.vn/kinh-te.rss',
            'health': 'https://baotintuc.vn/suc-khoe.rss',
            'sport': 'https://baotintuc.vn/the-thao.rss',
            'politic': 'https://baotintuc.vn/chinh-tri.rss',
            'technology': 'https://baotintuc.vn/cong-nghe.rss',
            'car': 'https://baotintuc.vn/xe.rss',
            'news': 'https://baotintuc.vn/thoi-su.rss',
        }
    },
    {
        'source': 'vietnamnet',
        'type': 'rss',
        'topic': {
            'economic': 'https://vietnamnet.vn/rss/kinh-doanh.rss',
            'health': 'https://vietnamnet.vn/rss/suc-khoe.rss',
            'sport': 'https://vietnamnet.vn/rss/the-thao.rss',
            'politic': 'https://vietnamnet.vn/rss/chinh-tri.rss',
            'technology': 'https://vietnamnet.vn/rss/cong-nghe.rss',
            'car': 'https://vietnamnet.vn/rss/oto-xe-may.rss',
            'news': 'https://vietnamnet.vn/rss/thoi-su.rss',
        }
    }
]

class TestCrawlers(unittest.TestCase):
    def test_thanhnien_crawler(self):
        self._test_crawler(ThanhNienCrawler, sources[0]['topic'])

    def test_vnexpress_crawler(self):
        self._test_crawler(VnexpressCrawler, sources[1]['topic'])

    def test_dantri_crawler(self):
        self._test_crawler(DanTriCrawler, sources[2]['topic'])

    def test_baotintuc_crawler(self):
        self._test_crawler(BaoTinTucCrawler, sources[3]['topic'])

    def test_vietnamnet_crawler(self):
        self._test_crawler(VietnamnetCrawler, sources[4]['topic'])


    def _test_crawler(self, crawler_class, topics):
        crawler = crawler_class(topics)
        news: list[News] = crawler.crawl()
        self.assertIsNotNone(news)
        self.assertGreater(len(news), 0)
        for n in news:
            self.assertIsNotNone(n.title)
            self.assertIsNotNone(n.link)
            self.assertIsNotNone(n.date)
            self.assertIsNotNone(n.image)
            self.assertIsNotNone(n.content)
            self.assertGreater(n.date, datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')) - timedelta(days=1), True) 
            self.assertNotIn('<![CDATA[', n.title)
            self.assertNotIn('<![CDATA[', n.link)

if __name__ == '__main__':
    unittest.main()