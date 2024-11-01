FROM python:3.9
WORKDIR /server
COPY . /server
RUN pip install -r /server/requirements.txt
CMD ["python", "app.py"]