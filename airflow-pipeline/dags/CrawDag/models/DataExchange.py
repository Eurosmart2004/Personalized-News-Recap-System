from airflow.models import TaskInstance

class DataExchange:
    def __init__(self, task_instance: TaskInstance):
        self.task_instance = task_instance

    def push(self, key: str, value: any):
        self.task_instance.xcom_push(key=key, value=value)

    def pull(self, task_ids: str, key: str) -> any:
        return self.task_instance.xcom_pull(task_ids=task_ids, key=key)