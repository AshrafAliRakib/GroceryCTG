FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY requirements.txt /code/
RUN apt-get update && apt-get install -y build-essential libpq-dev gcc && \
    pip install --upgrade pip && pip install -r requirements.txt && \
    apt-get purge -y --auto-remove build-essential gcc
COPY . /code/
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "ctggrocery.wsgi:application", "--bind", "0.0.0.0:8000"]
