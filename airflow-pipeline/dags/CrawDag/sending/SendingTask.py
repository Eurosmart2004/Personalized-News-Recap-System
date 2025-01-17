from CrawDag.models import TaskHandle, DataExchange, News
from CrawDag.saving import SavingTask
from CrawDag.saving.SavingMethod import MongoDataLake
import time
import requests

class SendingTask(TaskHandle):
    task_ids = None
    key = 'send_news'

    def __init__(self, task_ids: str) -> None:
        super().__init__()
        SendingTask.task_ids = task_ids
        self.__maxRetry = 4
        self.__delay = 15

    def execute(self, **context: any):
        dataExchange = DataExchange(context['ti'])
        listNewsId = dataExchange.pull(SavingTask.task_ids, SavingTask.key)

        for attempt in range(self.__maxRetry):
            try:
                # response = requests.post('http://nginx:5000/api/news/summarize', json=listNewsId)
                response = requests.post('https://rdf29197-5000.asse.devtunnels.ms/api/news/summarize', json=listNewsId)
                if response.status_code == 202:
                    return
                else:
                    print(f"Attempt {attempt + 1} failed: {response.status_code}")
                    time.sleep(self.__delay)

            except requests.RequestException as e: 
                print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(self.__delay)
        
        dataLake = SavingTask(SavingTask.task_ids).dataLake
        dataLake.delete(listNewsId)
        print('Failed to send data to API')
        raise Exception('Failed to send data to API')