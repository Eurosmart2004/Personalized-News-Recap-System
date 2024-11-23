from abc import ABC, abstractmethod
class TaskHandle(ABC):
    @abstractmethod
    def execute(self, **context: any):
        pass