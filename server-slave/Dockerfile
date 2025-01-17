FROM python:3.9
WORKDIR /server-slave
COPY . /server-slave
RUN pip install -r /server-slave/requirements.txt
EXPOSE 7000
CMD ["python", "app.py"]