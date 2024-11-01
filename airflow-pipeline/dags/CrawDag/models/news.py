from datetime import datetime
class News:
    def __init__(self, 
                 topic: str = '', 
                 title: str = '', 
                 content: str = '', 
                 link: str = '', 
                 date: datetime = None, 
                 image: str = '',
                 html: str = ''):
        self.topic = topic
        self.title = title
        self.content = content
        self.link = link
        self.date = date
        self.image = image
        self.html = html

    def __str__(self):
        return f"Title: {self.title}, Content: {self.content}, URL: {self.url}, Date: {self.date}, Source: {self.source}"

    def to_json(self):
        return {
            'topic': self.topic,
            'title': self.title,
            'content': self.content,
            'link': self.link,
            'date': self.date.isoformat(),
            'image': self.image,
            'html': self.html,
        }
    
    def __eq__(self, value: object) -> bool:
        if not isinstance(value, News):
            return False
        return self.topic == value.topic and self.title == value.title and self.content == value.content

    @classmethod
    def from_json(cls, data):
        """Convert JSON data back to News object."""
        data['date'] = datetime.fromisoformat(data['date'])  # Convert string back to datetime
        return cls(**data)