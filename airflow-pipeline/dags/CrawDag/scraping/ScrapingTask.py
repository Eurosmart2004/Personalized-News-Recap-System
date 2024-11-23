from CrawDag.models import TaskHandle, DataExchange, News
from CrawDag.crawling import CrawlingTask
from .ScrapeMethod import ScrapeArticle
from .Scraper import Scraper
class ScrapingTask(TaskHandle):
    task_ids = None
    key = 'scrape_news'

    def __init__(self, task_ids: str) -> None:
        super().__init__()
        ScrapingTask.task_ids = task_ids

    def execute(self, **context: any):
        dataExchange = DataExchange(context['ti'])
        listNewsJson = dataExchange.pull(CrawlingTask.task_ids, CrawlingTask.key)
        listNews = [News.from_json(newsJson) for newsJson in listNewsJson]

        newsList:list[News] = ScrapeArticle(listNews).scrape()
        dataExchange.push(ScrapingTask.key, [news.to_json() for news in newsList])
        
