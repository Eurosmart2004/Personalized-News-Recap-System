from CrawDag.models import TaskHandle, DataExchange, News
from .RssCrawler import *
from .Crawler import Crawler
class CrawlingTask(TaskHandle):
    task_ids = None
    key = 'crawl_news'    

    def __init__(self, task_ids: str) -> None:
        super().__init__()
        CrawlingTask.task_ids = task_ids
        self.sources = [
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

    def execute(self, **context: any):
        news: list[News] = []
        for source in self.sources:
            if source['source'] == 'vnexpress':
                crawler:Crawler = VnexpressCrawler(source['topic'])
            elif source['source'] == 'thanhnien':
                crawler:Crawler = ThanhNienCrawler(source['topic'])
            elif source['source'] == 'dantri':
                crawler:Crawler = DanTriCrawler(source['topic'])
            elif source['source'] == 'baotintuc':
                crawler:Crawler = BaoTinTucCrawler(source['topic'])
            elif source['source'] == 'vietnamnet':
                crawler:Crawler = VietnamnetCrawler(source['topic'])
            news.extend(crawler.crawl())
        
        from CrawDag.saving.SavingMethod import MongoDataLake

        dataLake = MongoDataLake()
        list_news_filter : list[News] = []
        for new in news:
            if dataLake.isExist(new):
                continue
            list_news_filter.append(new)
        dataExchange = DataExchange(context['ti'])
        dataExchange.push(CrawlingTask.key, [new.to_json() for new in list_news_filter])
    
        
