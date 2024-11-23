from abc import ABC, abstractmethod
from CrawDag.models import News
class Crawler(ABC):
    @abstractmethod
    def crawl(self) -> list[News]:
        pass