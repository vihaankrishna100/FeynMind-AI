from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_generate_quiz():
    response = client.post("/api/quiz", json={
        "topic": "Photosynthesis"
    })
    assert response.status_code == 200
    data = response.json()
    assert "topic" in data
    assert "difficulty" in data
    assert "questions" in data
    assert len(data["questions"]) >= 5
    assert len(data["questions"]) <= 10



def test_generate_quiz_with_difficulty():
    response = client.post("/api/quiz", json={
        "topic": "Machine Learning",
        "difficulty": "hard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["difficulty"] in ["easy", "medium", "hard"]


def test_feynman_chat():
    response = client.post("/api/chat", json={
        "topic": "Photosynthesis",
        "transcript": "Plants use sunlight to make food",
        "history": []
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "followups" in data
    assert "suggest_quiz" in data

def test_save_minutes():
    response = client.post("/api/minutes", json={
        "topic": "Photosynthesis",
        "minutes": 15
    })
    assert response.status_code == 200
    assert response.json() == {"success": True}

def test_save_attempt():
    response = client.post("/api/attempt", json={
        "topic": "Photosynthesis",
        "questions": 5,
        "score": 4,
        "accuracy": 80
    })
    assert response.status_code == 200
    assert response.json() == {"success": True}


def test_empty_topic_quiz():
    response = client.post("/api/quiz", json={
        "topic": ""
    })
    assert response.status_code == 400

def test_empty_topic_chat():
    response = client.post("/api/chat", json={
        "topic": "",
        "transcript": "Some explanation",
        "history": []
    })
    assert response.status_code == 400

def test_empty_transcript_chat():
    response = client.post("/api/chat", json={
        "topic": "Photosynthesis",
        "transcript": "",
        "history": []
    })
    assert response.status_code == 400

def test_invalid_difficulty():
    response = client.post("/api/quiz", json={
        "topic": "Photosynthesis",
        "difficulty": "invalid"
    })
    assert response.status_code == 422

def test_topic_too_long():
    long_topic = "a" * 121
    response = client.post("/api/quiz", json={
        "topic": long_topic
    })
    assert response.status_code == 422

def test_negative_minutes():
    response = client.post("/api/minutes", json={
        "topic": "Photosynthesis",
        "minutes": -1
    })
    assert response.status_code == 422

def test_negative_score():
    response = client.post("/api/attempt", json={
        "topic": "Photosynthesis",
        "questions": 5,
        "score": -1,
        "accuracy": 80
    })
    assert response.status_code == 422

def test_accuracy_out_of_range():
    response = client.post("/api/attempt", json={
        "topic": "Photosynthesis",
        "questions": 5,
        "score": 4,
        "accuracy": 101
    })
    assert response.status_code == 422
