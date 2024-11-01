from flask import Request, Response, jsonify, make_response
from services import preferenceService

def get_preference(request: Request)-> Response:
    preferences = preferenceService.get_preference()
    return make_response(jsonify({
        'message': 'Preferences retrieved successfully',
        'preferences': preferences
    }), 200)

def create_preference(request: Request)-> Response:
    data = request.get_json()
    if 'preferences' not in data:
        return make_response(jsonify({'error': 'Missing required fields'}), 400)
    
    preferences = data['preferences']
    if not isinstance(preferences, list):
        return make_response(jsonify({'error': 'Invalid data type'}), 400)
    
    for preference in preferences:
        if not isinstance(preference, str) or preference.strip() == "":
            return make_response(jsonify({'error': 'Invalid data type'}), 400)

    try:
        preferenceService.create_preference(preferences)
        preferencesList = preferenceService.get_preference()
        return make_response(jsonify({
            'message': 'Preferences created successfully',
            'preferences': preferencesList
        }), 201)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)
    

def update_preference(request: Request)-> Response:
    data = request.get_json()
    if not all(key in data for key in ('oldPreference', 'newPreference')):
        return make_response(jsonify({'error': 'Missing required fields'}), 400)
    
    oldPreference = data['oldPreference']
    newPreference = data['newPreference']
    try:
        preferenceService.update_preference(oldPreference, newPreference)
        preferences = preferenceService.get_preference()
        return make_response(jsonify({
            'message': 'Preference updated successfully',
            'preferences': preferences
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)

def delete_preference(request: Request)-> Response:
    data = request.get_json()
    if 'preference' not in data:
        return make_response(jsonify({'error': 'Missing required fields'}), 400)
    
    preference = data['preference']
    try:
        preferenceService.delete_preference(preference)
        preferences = preferenceService.get_preference()
        return make_response(jsonify({
            'message': 'Preference deleted successfully',
            'preferences': preferences
        }), 200)
    except ValueError as e:
        return make_response(jsonify({'error': str(e)}), 400)