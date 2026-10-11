import pytest


def test_study_task_crud(client):
    # 1. Create a task
    create_res = client.post(
        "/api/v1/tasks",
        json={
            "day": "Tue",
            "subject": "Physics",
            "topic": "Electromagnetic Induction",
            "title": "Solve 20 Lenz Law problems",
            "durationMinutes": 45,
            "taskType": "Problem Practice",
            "priority": "High",
            "reason": "Weak accuracy in Mock 9",
            "isAutoRecommended": False
        }
    )
    assert create_res.status_code == 200
    task_data = create_res.json()
    task_id = task_data["id"]
    assert task_data["completed"] is False
    assert task_data["title"] == "Solve 20 Lenz Law problems"

    # 2. List tasks
    list_res = client.get("/api/v1/tasks")
    assert list_res.status_code == 200
    tasks = list_res.json()
    assert any(t["id"] == task_id for t in tasks)

    # 3. Patch task to completed
    patch_res = client.patch(
        f"/api/v1/tasks/{task_id}",
        json={"completed": True}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["completed"] is True

    # 4. Delete task
    del_res = client.delete(f"/api/v1/tasks/{task_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # 5. Verify deleted
    list_after = client.get("/api/v1/tasks").json()
    assert not any(t["id"] == task_id for t in list_after)


def test_auto_plan_from_weak_topics(client):
    res = client.post(
        "/api/v1/tasks/from-weak-topics",
        json=[
            {
                "topic": "Complex Numbers",
                "subject": "Mathematics",
                "priority": "High",
                "reason": "Repeated errors across mocks"
            }
        ]
    )
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) >= 1
    assert any(t["topic"] == "Complex Numbers" for t in tasks)
