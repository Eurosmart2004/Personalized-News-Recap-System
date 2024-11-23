from celery import Celery, Task
from flask import Flask
from celery.schedules import crontab


def make_celery(app: Flask) -> Celery:
    class ContextTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery = Celery(app.import_name)
    celery.conf.update(app.config['CELERY_CONFIG'])
    celery.Task = ContextTask
    from tasks import tasks
    tasks.init(celery)
    return celery