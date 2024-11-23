from abc import ABC, abstractmethod
from CrawDag.models import News
class DataLake(ABC):
    @abstractmethod
    def save(self, listNews: list[News]) -> list[str]:
        pass

    @abstractmethod
    def delete(self, listNewsId: list[str]) -> None:
        pass
