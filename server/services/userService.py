import requests
from models import User, Preference, UserPreference, UserSchedule, Schedule
from jwt.exceptions import ExpiredSignatureError
from database.db import db
import re
from dotenv import load_dotenv
from .tokenService import create_access_token, create_refresh_token, create_forgot_password_token, decode_token, create_confirm_token
from tasks.sendEmail.sendConfirmation import send_email_confirmation
from tasks.sendEmail.sendForgotPassword import send_email_forgot_password
from typing import Union
from datetime import time
import secrets
import bcrypt
import os

load_dotenv()

def validate_password(password):
    if len(password) < 8:
        raise ValueError('Password must be at least 8 characters long')
    if not re.search(r'[A-Z]', password):
        raise ValueError('Password must contain at least one uppercase letter')
    if not re.search(r'[0-9]', password):
        raise ValueError('Password must contain at least one number')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValueError('Password must contain at least one special character')

def get_user(userID: str) -> User:
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')
    return user

def update_user(userID: str, name: str, picture: str, password: Union[str, None]) -> User:
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')
    user.name = name
    user.picture = picture
    if password:
        validate_password(password)
        salt = os.environ.get('SALT')
        hashed_password = bcrypt.hashpw(password.encode(), salt.encode())
        user.password = hashed_password

    db.session.commit()
    return user.to_json()

def register(name: str, email:str, password:str, role='user', isConfirmed = False) -> User:
    if User.query.filter_by(email=email).first():
        raise ValueError('Email already exists')
    if name == '' or email == '' or password == '':
        raise ValueError('Name, email, password are required')
    
    validate_password(password)

    salt = os.environ.get('SALT')
    hashed_password = bcrypt.hashpw(password.encode(), salt.encode())
    user = User(name=name, email=email, password=hashed_password, role=role, isConfirmed=isConfirmed)
    try:
        db.session.add(user)
        db.session.commit()
        accessToken = create_access_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })

        refreshToken = create_refresh_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })
        return accessToken, refreshToken, user.to_json()
    except ValueError as e:
        db.session.rollback()
        raise e

def forgot_password(email: str):
    user: Union[User, any] = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError('User does not exist')
    
    token = create_forgot_password_token({
        'id': user.id,
        'email': user.email,
        'role': user.role
    })

    send_email_forgot_password(user, token)

def reset_password(token, password):
    try:
        payload = decode_token(token, os.environ.get('FORGOT_PASSWORD_TOKEN_KEY'))
        user: Union[User, any] = User.query.get(payload['id'])
        if not user:
            raise ValueError('User does not exist')
        
        validate_password(password)

        salt = os.environ.get('SALT')
        hashed_password = bcrypt.hashpw(password.encode(), salt.encode())
        user.password = hashed_password
        db.session.commit()
        accessToken = create_access_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })

        refreshToken = create_refresh_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })
        return accessToken, refreshToken, user.to_json()
    except ExpiredSignatureError:
        raise ValueError('The link has expired. Please click to resend the email.')

def get_confirm_user(email: str):
    user: Union[User, any] = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError('User does not exist')

    if user.isConfirmed:
        raise ValueError('User is already confirmed')
    
    token = create_confirm_token({
        'id': user.id,
        'email': user.email,
        'role': user.role
    })
    print(token)
    send_email_confirmation(user, token)

def update_confirm_user(token) -> User:
    try:
        payload = decode_token(token, os.environ.get('CONFIRM_TOKEN_KEY'))
        user: Union[User, any] = User.query.get(payload['id'])
        if not user:
            raise ValueError('User does not exist')
        if user.isConfirmed:
            raise ValueError('User is already confirmed')
        
        user.isConfirmed = True
        db.session.commit()
        accessToken = create_access_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })

        refreshToken = create_refresh_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })
        return accessToken, refreshToken, user.to_json()
    except ValueError as e:
        raise e
    except ExpiredSignatureError:
        raise ValueError("Token has expired")

def login(email: str, password: str) -> tuple:
    user: Union[User, any] = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError('Wrong email or password')

    if not user.password:
        raise ValueError('User does not have a password set. Please log in with Google.')
    
    validate_password(password)

    if not bcrypt.checkpw(password.encode(), user.password.encode()):
        raise ValueError('Wrong email or password')
    
    
    accessToken = create_access_token({
        'id': user.id,
        'email': user.email,
        'role': user.role
    })

    refreshToken = create_refresh_token({
        'id': user.id,
        'email': user.email,
        'role': user.role
    })

    return accessToken, refreshToken, user.to_json()

def login_with_google(token) -> tuple:
    try:

        userinfo = requests.get(f'https://www.googleapis.com/oauth2/v3/userinfo',
                                headers={'Authorization': f'Bearer {token}'}).json()
        if 'error' in userinfo:
            raise ValueError('Invalid Credentials')
        
        email = userinfo['email']
        name = userinfo['name']
        picture = userinfo['picture']
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(name=name, email=email, isConfirmed=True, picture=picture)           
            db.session.add(user)
            db.session.commit()

        accessToken = create_access_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })

        refreshToken = create_refresh_token({
            'id': user.id,
            'email': user.email,
            'role': user.role
        })

        return accessToken, refreshToken, user.to_json()

    except ValueError as e:
        db.session.rollback()
        raise e
    
def get_preferences(userID: str) -> list:
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')

    user_preferences: list[UserPreference] = UserPreference.query.filter_by(user_id=user.id).all()
    return [user_preference.preference.name for user_preference in user_preferences]

def update_preferences(userID: str, preferences: list) -> list[Preference.name]:
    # Get the user
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')
    
    user.isFirstLogin = False
    
    prefercesList: list[Preference.name] = []
    try:
        # Remove existing preferences
        UserPreference.query.filter_by(user_id=user.id).delete()
        # Add new preferences
        for preference in preferences:
            preference_obj: Union[Preference, any] = Preference.query.filter_by(name=preference).first()
            if not preference_obj:
                raise ValueError(f'Preference {preference} does not exist')

            user_preference = UserPreference(user_id=user.id, preference_id=preference_obj.id)
            prefercesList.append(preference_obj.name)
            db.session.add(user_preference)

        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        raise e

    return prefercesList

def get_schedule(userID: str) -> list[Schedule.to_json]:
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')
    
    schedulesList: list[Schedule.to_json] = []

    user_schedules: list[UserSchedule] = UserSchedule.query.filter_by(user_id=user.id).all()
    for user_schedule in user_schedules:
        schedule: Schedule = user_schedule.schedule
        schedulesList.append(schedule.to_json())

    return schedulesList

def update_schedule(userID: str, schedules: list) -> list[Schedule.to_json]:
    user: Union[User, any] = User.query.get(userID)
    if not user:
        raise ValueError('User does not exist')

    schedulesList: list[Schedule.to_json] = []
    if len(schedules) != 2:
        raise ValueError('Invalid number of schedules')
    
    if (int(schedules[0]['hour']) == int(schedules[1]['hour']) and 
        int(schedules[0]['minute']) == int(schedules[1]['minute'])):
        raise ValueError('Schedules cannot be the same')
    
    try:
        # Remove existing schedules
        UserSchedule.query.filter_by(user_id=user.id).delete()
        for s in schedules:
            schedule_obj: Schedule = Schedule.query.filter_by(time=time(hour=s['hour'], minute=s['minute'])).first()
            user_schedule: UserSchedule = UserSchedule(user_id=user.id, schedule_id=schedule_obj.id)
            schedulesList.append(schedule_obj.to_json())
            db.session.add(user_schedule)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        raise e

    return schedulesList