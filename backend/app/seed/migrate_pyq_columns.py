import sqlite3
import os

DB_PATH = "jee_insight.db"


def migrate():
    if not os.path.exists(DB_PATH):
        print(f"[INFO] Database {DB_PATH} not found, will be created on startup.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(questions);")
    existing_cols = {r[1] for r in cursor.fetchall()}

    new_cols = [
        ("year", "INTEGER"),
        ("exam_session", "VARCHAR(64)"),
        ("shift", "VARCHAR(64)"),
        ("chapter", "VARCHAR(128)"),
        ("question_type", "VARCHAR(32) DEFAULT 'single_correct'"),
        ("numerical_answer", "VARCHAR(64)"),
        ("source_paper", "VARCHAR(256)"),
        ("is_pyq", "INTEGER DEFAULT 1"),
        ("verification_status", "VARCHAR(32) DEFAULT 'VERIFIED'"),
        ("diagram_data", "JSON")
    ]

    added = 0
    for col_name, col_type in new_cols:
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE questions ADD COLUMN {col_name} {col_type};")
            print(f"  Added column '{col_name}' ({col_type})")
            added += 1

    conn.commit()
    cursor.execute("PRAGMA table_info(questions);")
    final_cols = [r[1] for r in cursor.fetchall()]
    conn.close()

    print(f"[SUCCESS] Migration complete. Added {added} columns. Total columns: {len(final_cols)}")


if __name__ == "__main__":
    migrate()
