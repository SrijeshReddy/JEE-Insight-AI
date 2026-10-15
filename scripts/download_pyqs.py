import os
import sys
import time
import httpx
import json

BASE_URL = "https://huggingface.co/datasets/soughed/jee-main-questions/resolve/main"
RAW_README_URL = "https://huggingface.co/datasets/soughed/jee-main-questions/raw/main/README.md"

TARGET_FILES = [
    ("chemistry/train.jsonl", "data/question_bank/raw/chemistry/train.jsonl"),
    ("chemistry/test.jsonl", "data/question_bank/raw/chemistry/test.jsonl"),
    ("physics/train.jsonl", "data/question_bank/raw/physics/train.jsonl"),
    ("physics/test.jsonl", "data/question_bank/raw/physics/test.jsonl"),
    ("mathematics/train.jsonl", "data/question_bank/raw/mathematics/train.jsonl"),
    ("mathematics/test.jsonl", "data/question_bank/raw/mathematics/test.jsonl"),
]


def download_file(url: str, dest_path: str, retries: int = 3, timeout: float = 60.0):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    for attempt in range(1, retries + 1):
        try:
            print(f"Downloading {url} -> {dest_path} (Attempt {attempt}/{retries})...")
            with httpx.Client(follow_redirects=True, timeout=timeout) as client:
                response = client.get(url)
                response.raise_for_status()
                with open(dest_path, "wb") as f:
                    f.write(response.content)
            file_size_kb = os.path.getsize(dest_path) / 1024.0
            print(f"  [SUCCESS] Saved {dest_path} ({file_size_kb:.2f} KB)")
            return True
        except Exception as e:
            print(f"  [WARNING] Download error on attempt {attempt}: {e}")
            if attempt < retries:
                time.sleep(2 * attempt)
            else:
                print(f"  [ERROR] Failed to download {url} after {retries} attempts.")
                return False


def main():
    print("=" * 60)
    print("JEE InsightAI — Phase 3: Downloading JEE Main PYQ Dataset")
    print("Source: https://huggingface.co/datasets/soughed/jee-main-questions")
    print("License: CC-BY-4.0")
    print("=" * 60)

    # 1. Download source README
    readme_dest = "data/question_bank/metadata/source_README.md"
    download_file(RAW_README_URL, readme_dest)

    # 2. Download raw JSONL files
    total_files = len(TARGET_FILES)
    downloaded_files = 0
    total_questions = 0

    for rel_path, dest_path in TARGET_FILES:
        url = f"{BASE_URL}/{rel_path}"
        if download_file(url, dest_path):
            downloaded_files += 1
            # Count questions
            with open(dest_path, "r", encoding="utf-8") as f:
                lines = [line.strip() for line in f if line.strip()]
                count = len(lines)
                total_questions += count
                print(f"    -> Contains {count} question records.")

    print("=" * 60)
    print(f"Download Summary:")
    print(f"  Files downloaded: {downloaded_files}/{total_files}")
    print(f"  Total raw question records: {total_questions}")
    print("=" * 60)

    if downloaded_files != total_files:
        sys.exit(1)


if __name__ == "__main__":
    main()
