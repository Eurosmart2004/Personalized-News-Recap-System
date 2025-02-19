from database.database import db
from models import User, Preference, Schedule
from sqlalchemy.orm.exc import NoResultFound
from datetime import time, timedelta, datetime
from flask import Flask
import os
from dotenv import load_dotenv
from services import userService
load_dotenv()
def init_db(app: Flask):
    with app.app_context():
        db.create_all()


        # Initialize default preferences
        preferences = ['economic', 'health', 'sport', 'politic']

        for pref_name in preferences:
            try:
                preference = Preference.query.filter_by(name=pref_name).one()
            except NoResultFound:
                preference = Preference(name=pref_name)
                db.session.add(preference)

        # Commit all changes at once
        db.session.commit()

        # Initialize default schedule
        try:
            schedule = Schedule.query.filter_by(time=time(0, 0)).one()
        except NoResultFound:
            # Generate times from 00:00 to 23:59
            start_time = datetime.strptime('00:00', '%H:%M')
            end_time = datetime.strptime('23:59', '%H:%M')
            current_time = start_time

            while current_time <= end_time:
                schedule_time = current_time.time()
                new_schedule = Schedule(time=schedule_time)
                db.session.add(new_schedule)
                current_time += timedelta(minutes=1)

            db.session.commit()

        # Add admin account
        try:
            admin = User.query.filter_by(email=os.getenv("ADMIN_EMAIL")).one()
        except NoResultFound:
            name = os.getenv("ADMIN_USERNAME")
            email = os.getenv("ADMIN_EMAIL")
            password = os.getenv("ADMIN_PASSWORD")
            userService.register(name=name, email=email, password=password, role='admin', isConfirmed=True)