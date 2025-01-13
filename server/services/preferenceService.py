from models import Preference, UserPreference
from database.database import db
from flask import jsonify
from typing import Union
def get_preference():
    preferences: list[Preference] = Preference.query.all()
    return [preference.to_json() for preference in preferences]

def create_preference(preferences: list[Preference]):
    listPreference = []
    for pre in preferences:
        p = Preference.query.filter_by(name=pre).first()
        if p:
            continue
        preference = Preference(name=pre)
        db.session.add(preference)
        listPreference.append(preference.to_json())
    db.session.commit()


def update_preference(oldPreference: str, newPreference: str):
    if Preference.query.filter_by(name=newPreference).first():
        raise ValueError('Preference already exists')
    
    preference: Union[Preference, any] = Preference.query.filter_by(name=oldPreference).first()
    if not preference:
        raise ValueError('Preference not found')

    preference.name = newPreference
    db.session.commit()


def delete_preference(preference: str):
    preference: Union[Preference, any] = Preference.query.filter_by(name=preference).first()
    if not preference:
        raise ValueError('Preference not found')
    
    user_preferences = UserPreference.query.filter_by(preference_id=preference.id).all()
    for user_pref in user_preferences:
        db.session.delete(user_pref)
        
    db.session.delete(preference)
    db.session.commit()
    return None