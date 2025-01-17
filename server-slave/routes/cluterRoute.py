from app import app
from flask import request, jsonify
@app.route('/api/cluster', methods=['POST'])
def cluster():
    data = request.get_json()
    embeddings = data['embeddings']
    from sklearn.cluster import DBSCAN
    import numpy as np
    try:
        dbscan = DBSCAN(eps=0.3, min_samples=2, metric='cosine', n_jobs=-1)
        embeddings_array = np.array(embeddings)
        labels = dbscan.fit_predict(embeddings_array)
        labels = labels.tolist()
        return jsonify({'labels': labels})
    except Exception as e:
        return jsonify({'error': str(e)})
