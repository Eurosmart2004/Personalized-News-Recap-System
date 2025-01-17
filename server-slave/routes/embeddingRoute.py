from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify
import logging
from app import app
embedding_model = SentenceTransformer("dangvantuan/vietnamese-document-embedding", 
                                      trust_remote_code=True, 
                                      device='cpu')

@app.route('/api/embedding', methods=['POST'])
def embedding():
    data = request.get_json()
    logging.info(data)
    try:
        content = data['text']
        embedding = embedding_model.encode(content)
        embedding = embedding.tolist()
        return jsonify({'embedding': embedding})
    except Exception as e:
        return jsonify({'error': str(e)})
    
