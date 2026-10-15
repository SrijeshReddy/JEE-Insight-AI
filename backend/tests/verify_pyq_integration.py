import sys
import os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_integration():
    print("1. Testing /api/v1/tests...")
    res = client.get("/api/v1/tests")
    assert res.status_code == 200
    tests = res.json()
    print(f"  Total tests available: {len(tests)}")
    assert len(tests) >= 6

    print("\n2. Testing /api/v1/tests/pyq/catalog/stats...")
    stats_res = client.get("/api/v1/tests/pyq/catalog/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    print(f"  Total PYQ questions in DB: {stats['total_pyq_questions']}")
    print(f"  Subject distribution: {stats['subject_distribution']}")
    print(f"  Difficulty distribution: {stats['difficulty_distribution']}")
    print(f"  Question types: {stats['question_type_distribution']}")
    print(f"  Total chapters: {stats['total_distinct_chapters']}")
    assert stats['total_pyq_questions'] == 2241

    print("\n3. Testing /api/v1/tests/pyq/bank/search (Filtering Chemistry Thermodynamics)...")
    search_res = client.get("/api/v1/tests/pyq/bank/search?subject=Chemistry&chapter=Thermodynamics&limit=5")
    assert search_res.status_code == 200
    s_data = search_res.json()
    print(f"  Total matches for Chemistry Thermodynamics: {s_data['total']}")
    assert s_data['total'] > 0
    sample_search_q = s_data['items'][0]
    print(f"  Sample ID: {sample_search_q['id']}, Chapter: {sample_search_q['chapter']}, Type: {sample_search_q['questionType']}")

    print("\n4. Testing /api/v1/tests/pyq/bank/search (Filtering Physics Numerical Questions)...")
    num_res = client.get("/api/v1/tests/pyq/bank/search?subject=Physics&question_type=numerical&limit=5")
    assert num_res.status_code == 200
    num_data = num_res.json()
    print(f"  Total Physics Numerical questions: {num_data['total']}")
    assert num_data['total'] > 0
    sample_num_q = num_data['items'][0]
    print(f"  Sample Numerical Answer: {sample_num_q['numericalAnswer']}, Diff: {sample_num_q['difficulty']}")

    print("\n5. Testing /api/v1/tests/pyq-jee-2020-p01/questions (75-Q Official Paper)...")
    qres = client.get("/api/v1/tests/pyq-jee-2020-p01/questions")
    assert qres.status_code == 200
    questions = qres.json()
    print(f"  Total questions in Paper 01: {len(questions)}")
    assert len(questions) == 75

    print("\n6. Testing /api/v1/tests/pyq/generate-practice (Dynamic Practice Test Generation)...")
    gen_res = client.post("/api/v1/tests/pyq/generate-practice?title=Electrochemistry%20Sprint&subject=Chemistry&questions_count=10&duration_minutes=25")
    assert gen_res.status_code == 200
    gen_test = gen_res.json()
    print(f"  Created test ID: {gen_test['id']}, Questions: {gen_test['questionsCount']}, Max Marks: {gen_test['maxMarks']}")
    assert gen_test['questionsCount'] == 10

    # Verify questions for generated test can be fetched
    gen_q_res = client.get(f"/api/v1/tests/{gen_test['id']}/questions")
    assert gen_q_res.status_code == 200
    gen_qs = gen_q_res.json()
    assert len(gen_qs) == 10
    print(f"  Successfully fetched all 10 questions for generated test {gen_test['id']}")

    print("\n7. Testing backward compatibility with benchmark test mock-jee-09...")
    b_res = client.get("/api/v1/tests/mock-jee-09/questions")
    assert b_res.status_code == 200
    b_questions = b_res.json()
    print(f"  Benchmark test questions preserved: {len(b_questions)}")
    assert len(b_questions) == 15

    print("\n[ALL 7 INTEGRATION TESTS PASSED PERFECTLY!]")

if __name__ == "__main__":
    test_integration()
