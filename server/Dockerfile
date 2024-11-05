FROM python:3.9
WORKDIR /server
COPY . /server
RUN pip install -r /server/requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]