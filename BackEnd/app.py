from flask import Flask, jsonify
from flask_cors import CORS
import redis
import numpy as np
import pickle
import time

app = Flask(__name__)
CORS(app)

redis_host = '192.168.212.109'
redis_port = 6379

@app.route('/prediction')
def prediction():
    r = redis.Redis(host=redis_host, port=redis_port, socket_timeout=5)

    if r.ping():
        print("Redis server is connected")
    else:
        print("Could not connect to Redis server")

    num_readings = 5
    with open('/Users/sshanmugam/Downloads/best_model.pkl', 'rb') as f:
        best_model = pickle.load(f)

    while True:
        readings = []
        for i in range(1, num_readings + 1):
            key1 = 'Reading_{}'.format(i)
            latest_index1 = r.llen(key1) - 1
            reading = r.lindex(key1, latest_index1)
            readings.append(reading)
 
        key2 = 'Username'
        latest_index2 = r.llen(key2) - 1
        result = r.lindex(key2, latest_index2)
        username = result.decode('utf-8')
       
        read = np.array([float(val.decode('utf-8')) for val in readings])
        avg_reading = np.mean(read)
        
        readings = np.array(readings).reshape(1, -1)
        print(readings)
        predictions = best_model.predict(readings)
        
        print(predictions)
        scaled_reading_pct=0
        if predictions[0] == 0:
            max_reading = 200
            scaled_reading_pct = round(((avg_reading - 0) / (max_reading * 0.5 - 0) * 50), 2)
        else:
            continue
        #     max_reading = 100
        #     scaled_reading_pct = round(((avg_reading - max_reading * 0.5) / (max_reading * 0.5 - 0) * 50) + 50, 2)

        time.sleep(1)
        # print(scaled_reading_pct)
        return jsonify(prediction=scaled_reading_pct,name=username)
        # return jsonify(prediction=float(readings[3].decode('utf-8')),name=username)

if __name__ == '__main__':
    app.run(debug=True)


































# from flask import Flask, jsonify
# from flask_cors import CORS
# import random

# app = Flask(__name__)
# CORS(app)

# @app.route('/prediction')
# def prediction():
#     num = round(random.uniform(0, 1), 2)
#     return jsonify(prediction=num,name="Sanjay")

# if __name__ == '__main__':
#     app.run(debug=True)
