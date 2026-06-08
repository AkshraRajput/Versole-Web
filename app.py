from flask import Flask, request, jsonify, render_template
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
DB_PATH = "interests.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            heel_preference TEXT,
            message TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/interest", methods=["POST"])
def submit_interest():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()
    heel_preference = data.get("heel_preference", "").strip()
    message = data.get("message", "").strip()

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 422

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO interests (name, email, phone, heel_preference, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, email, phone, heel_preference, message, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Thank you! We'll be in touch soon."}), 201

@app.route("/api/interests", methods=["GET"])
def get_interests():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, name, email, phone, heel_preference, message, created_at FROM interests ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    interests = [
        {"id": r[0], "name": r[1], "email": r[2], "phone": r[3],
         "heel_preference": r[4], "message": r[5], "created_at": r[6]}
        for r in rows
    ]
    return jsonify(interests)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
