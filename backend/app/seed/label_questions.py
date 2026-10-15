import sqlite3

def label_questions():
    conn = sqlite3.connect("jee_insight.db")
    cursor = conn.cursor()

    # Clean up ephemeral custom test rows from tests
    cursor.execute("DELETE FROM question_options WHERE question_id LIKE 'test-custom-%'")
    cursor.execute("DELETE FROM questions WHERE id LIKE 'test-custom-%'")
    cursor.execute("DELETE FROM mock_tests WHERE id LIKE 'test-custom-%'")

    # Mark synthetic / demo questions with is_pyq = 0
    cursor.execute("""
        UPDATE questions
        SET is_pyq = 0,
            source_paper = 'JEE InsightAI Benchmark Suite'
        WHERE id NOT LIKE 'JEE-%'
    """)

    cursor.execute("""
        UPDATE questions
        SET is_pyq = 1
        WHERE id LIKE 'JEE-%'
    """)

    conn.commit()

    cursor.execute("SELECT is_pyq, count(*) FROM questions GROUP BY is_pyq")
    results = cursor.fetchall()
    print("Question counts by is_pyq status:")
    for is_p, cnt in results:
        label = "Verified PYQs" if is_p == 1 else "Synthetic Benchmark / Custom Mock Questions"
        print(f"  {label} (is_pyq={is_p}): {cnt}")

    conn.close()

if __name__ == "__main__":
    label_questions()
