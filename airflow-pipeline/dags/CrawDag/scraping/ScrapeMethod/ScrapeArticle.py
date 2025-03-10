from CrawDag.scraping.Scraper import Scraper
from CrawDag.models import News
from newspaper import Article
class ScrapeArticle(Scraper):
    def __init__(self, listNews: list[News]) -> None:
        super().__init__(listNews)

    def scrape(self) -> list[News]:
        newsList: list[News] = []
        for news in self.listNews:
            try:
                article = Article(news.link)
                article.download()
                article.parse()
                paragraphs = article.text.split('\n')
                news.content = '\n'.join([para for para in paragraphs[0:-1]]).strip()
                # news.html = article.html
                if news.content != '' and len(news.content) > 10: # check if the content is not empty
                    newsList.append(news)

            except Exception as e:
                print(e)
                continue
            
        return newsList