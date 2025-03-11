from abc import ABC, abstractmethod
from CrawDag.models import News
import re
class Crawler(ABC):
    def __init__(self, topics: dict[str, str]) -> None:
        self.topics = topics
        
    @abstractmethod
    def crawl(self) -> list[News]:
        pass

    def clean_quotes(self, text: str) -> str:
        # Check if text starts and ends with a single quote.
        if text.startswith("'") and text.endswith("'"):
            quote_count = text.count("'")
            # If there are exactly two quotes, remove both.
            if quote_count == 2:
                return text[1:-1]
            else:
                # If more than two, assume the trailing quote is part of the content.
                return text[1:]
        return text