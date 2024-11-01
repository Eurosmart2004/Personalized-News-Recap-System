from database.db import db
async def hanhdle_summarize(article_ids: list[str]) -> str:
    from app import celery
    try:
        task = celery.send_task('summarize', args=[article_ids])
        return task.id
    except Exception as e:
        raise e


