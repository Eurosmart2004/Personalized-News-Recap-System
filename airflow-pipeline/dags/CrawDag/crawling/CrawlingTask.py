from CrawDag.models import TaskHandle, DataExchange, News
from .RssCrawler import ThanhNienCrawler, VnexpressCrawler
from .Crawler import Crawler
class CrawlingTask(TaskHandle):
    task_ids = None
    key = 'crawl_news'    

    def __init__(self, task_ids: str) -> None:
        super().__init__()
        CrawlingTask.task_ids = task_ids
        self.sources = [
            {
                'source': 'vnexpress',
                'type': 'rss',
                'topic': {
                    'economic': 'https://vnexpress.net/rss/kinh-doanh.rss',
                    'health': 'https://vnexpress.net/rss/suc-khoe.rss',
                    'sport': 'https://vnexpress.net/rss/the-thao.rss',
                    'politic': 'https://vnexpress.net/rss/the-gioi.rss'
                },
            },
            {
                'source': 'thanhnien',
                'type': 'rss',
                'topic': {
                    'economic': 'https://thanhnien.vn/rss/kinh-te.rss',
                    'health': 'https://thanhnien.vn/rss/suc-khoe.rss',
                    'sport': 'https://thanhnien.vn/rss/the-thao.rss',
                    'politic': 'https://thanhnien.vn/rss/chinh-tri.rss'
                },
            }
        ]

    def execute(self, **context: any):
        news: list[News] = []
        for source in self.sources:
            if source['source'] == 'vnexpress':
                crawler:Crawler = VnexpressCrawler(source['topic'])
            elif source['source'] == 'thanhnien':
                crawler:Crawler = ThanhNienCrawler(source['topic'])
            news.extend(crawler.crawl())
        news = news[:30]
        dataExchange = DataExchange(context['ti'])
        dataExchange.push(CrawlingTask.key, [new.to_json() for new in news])
    
        
