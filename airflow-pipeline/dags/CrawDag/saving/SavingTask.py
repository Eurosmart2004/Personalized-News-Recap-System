from CrawDag.models import TaskHandle, DataExchange, News
from CrawDag.scraping import ScrapingTask
from CrawDag.saving.SavingMethod import MongoDataLake
from .DataLake import DataLake
class SavingTask(TaskHandle):
    task_ids = None
    key = 'scrape_news'

    def __init__(self, task_ids: str) -> None:
        super().__init__()
        SavingTask.task_ids = task_ids
        self.dataLake: DataLake = MongoDataLake()

    def execute(self, **context: any):
        dataExchange = DataExchange(context['ti'])
        listNewsJson = dataExchange.pull(ScrapingTask.task_ids, ScrapingTask.key)
        listNews = [News.from_json(newsJson) for newsJson in listNewsJson]

        listNewsId = self.dataLake.save(listNews)
        dataExchange.push(SavingTask.key, listNewsId)
