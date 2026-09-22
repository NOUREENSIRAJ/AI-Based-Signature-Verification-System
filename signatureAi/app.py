from flask import Flask, request, jsonify
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

app = Flask(__name__)

# -------------------------
# PREPROCESS IMAGE
# -------------------------
def preprocess(file):
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

    img = cv2.resize(img, (300, 150))
    img = cv2.GaussianBlur(img, (5, 5), 0)
    _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    return img


# -------------------------
# API ROUTE
# -------------------------
@app.route("/compare-signatures", methods=["POST"])
def compare_signatures():
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({"error": "Please upload image1 and image2"}), 400

    img1 = preprocess(request.files['image1'])
    img2 = preprocess(request.files['image2'])

    score, _ = ssim(img1, img2, full=True)

    result = "same" if score > 0.75 else "different"

    return jsonify({
        "similarity": float(score),
        "result": result
    })


# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from skimage.metrics import structural_similarity as ssim
# import os

# app = Flask(__name__)

# def preprocess(file):
#     img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
#     img = cv2.resize(img, (300, 150))
#     img = cv2.GaussianBlur(img, (5, 5), 0)
#     _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
#     return img

# @app.route("/compare-signatures", methods=["POST"])
# def compare():
#     if "image1" not in request.files or "image2" not in request.files:
#         return jsonify({"error": "Missing images"}), 400

#     img1 = preprocess(request.files["image1"])
#     img2 = preprocess(request.files["image2"])

#     score, _ = ssim(img1, img2, full=True)

#     return jsonify({
#         "similarity": float(score),
#         "result": "same" if score > 0.75 else "different"
#     })

