from datetime import datetime
from bson.objectid import ObjectId
def get_article_from_ids(article_ids: list[str]):
    from app import mongo
    articles = []

    for article_id in article_ids:
        article = mongo.db.news.find_one({'_id': ObjectId(article_id)})

        if article:
            # Check if an article with the same link already exists in the list
            existing_article = next((a for a in articles if a['link'] == article['link']), None)

            if existing_article:
                # If the existing article is older, replace it with the new one
                if existing_article['date'] < article['date']:
                    articles.remove(existing_article)
                    articles.append(article)
            else:
                # If no existing article with the same title, add the new one to the list
                articles.append(article)
    return articles

