from selenium import webdriver
from selenium.webdriver.common.by import By
from CrawDag.models import News
from datetime import datetime
def crawl_selenium(topic, url):
    """Crawl articles using Selenium."""
    driver = webdriver.Chrome()  # Adjust to your WebDriver setup
    driver.get(url)

    news = []
    elements = driver.find_elements(By.TAG_NAME, 'article')
    for element in elements:
        title = element.find_element(By.TAG_NAME, 'h2').text
        link = element.find_element(By.TAG_NAME, 'a').get_attribute('href')
        date = element.find_element(By.CLASS_NAME, 'publish-date').text
        date = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %z')
        news.append(News(topic=topic, title=title, link=link, date=date))

    driver.quit()
    return news
