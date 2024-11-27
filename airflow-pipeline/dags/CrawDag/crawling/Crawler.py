from abc import ABC, abstractmethod
from CrawDag.models import News
class Crawler(ABC):
    def __init__(self, topics: dict[str: str]) -> None:
        self.topics = topics
        
    @abstractmethod
    def crawl(self) -> list[News]:
        pass