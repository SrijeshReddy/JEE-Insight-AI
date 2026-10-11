import pytest


def test_attempt_workflow(client):
    # 1. Start an attempt
    start_res = client.post(
        "/api/v1/attempts/start",
        json={"testId": "mock-jee-09", "studentId": "student-aarav-01"}
    )
    assert start_res.status_code == 200
    start_data = start_res.json()
    attempt_id = start_data["attemptId"]
    assert attempt_id.startswith("attempt-")
    assert start_data["status"] == "in_progress"

    # 2. Record response for question q-m9-p01
    resp_res = client.post(
        f"/api/v1/attempts/{attempt_id}/response?question_id=q-m9-p01",
        json={
            "selectedOption": "B",
            "markedForReview": False,
            "timeSpentSeconds": 45
        }
    )
    assert resp_res.status_code == 200
    assert resp_res.json()["status"] == "recorded"

    # 3. Record telemetry for question q-m9-p01
    telem_res = client.post(
        f"/api/v1/attempts/{attempt_id}/telemetry?question_id=q-m9-p01",
        json={
            "visitCount": 2,
            "timeToFirstActionSeconds": 15.5,
            "answerChangeCount": 1,
            "reviewToggleCount": 0,
            "initialOption": "A",
            "finalOption": "B",
            "telemetryEvents": [{"type": "option_change", "timestamp": 12345}]
        }
    )
    assert telem_res.status_code == 200
    assert telem_res.json()["status"] == "telemetry_recorded"

    # 4. Submit the attempt
    submit_res = client.post(
        f"/api/v1/attempts/{attempt_id}/submit",
        json={
            "studentId": "student-aarav-01",
            "timeSpentSeconds": 180,
            "responses": {
                "q-m9-p01": {
                    "selectedOption": "B",
                    "markedForReview": False,
                    "timeSpentSeconds": 45
                },
                "q-m9-p02": {
                    "selectedOption": "A",
                    "markedForReview": False,
                    "timeSpentSeconds": 60
                }
            }
        }
    )
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert submit_data["id"] == attempt_id
    assert "score" in submit_data
    assert "accuracy" in submit_data
    assert "subjectBreakdown" in submit_data

    # 5. Duplicate submission check: submitting again returns the completed record safely
    dup_res = client.post(
        f"/api/v1/attempts/{attempt_id}/submit",
        json={
            "studentId": "student-aarav-01",
            "timeSpentSeconds": 180,
            "responses": {}
        }
    )
    assert dup_res.status_code == 200
    assert dup_res.json()["id"] == attempt_id
    assert dup_res.json()["score"] == submit_data["score"]

    # 6. Retrieve attempt details
    get_res = client.get(f"/api/v1/attempts/{attempt_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == attempt_id

    # 7. List attempts
    list_res = client.get("/api/v1/attempts")
    assert list_res.status_code == 200
    attempts = list_res.json()
    assert any(a["id"] == attempt_id for a in attempts)
