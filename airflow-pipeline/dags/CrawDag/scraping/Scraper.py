from abc import ABC, abstractmethod
from CrawDag.models import News
class Scraper(ABC):
    @abstractmethod
    def __init__(self, listNews: list[News]) -> None:
        self.listNews = listNews

    @abstractmethod
    def scrape(self) -> list[News]:
        pass