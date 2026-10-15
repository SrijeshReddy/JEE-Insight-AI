# JEE InsightAI — Question Bank Documentation

## 1. Dataset Overview

- **Dataset Name**: JEE Main Question Bank (`soughed/jee-main-questions`, mirrored as `eQOURSE/jee-main-questions`)
- **Source URL**: [https://huggingface.co/datasets/soughed/jee-main-questions](https://huggingface.co/datasets/soughed/jee-main-questions)
- **Primary Source / Provenance**: Curated JEE Main examination papers across Chemistry, Physics, and Mathematics with original question text, options, numerical answers, worked step-by-step solutions, and diagrams.
- **License**: Creative Commons Attribution 4.0 International (**CC-BY-4.0**)
- **Attribution**: "Dataset curated by soughed / eQOURSE, distributed under CC-BY-4.0 via Hugging Face Datasets."
- **Download Timestamp**: October 2026 (Local project retrieval)
- **Local Directory Structure**:
  ```
  data/question_bank/
  ├── raw/
  │   ├── chemistry/
  │   │   ├── train.jsonl (627 questions)
  │   │   └── test.jsonl (111 questions)
  │   ├── physics/
  │   │   ├── train.jsonl (652 questions)
  │   │   └── test.jsonl (116 questions)
  │   └── mathematics/
  │       ├── train.jsonl (680 questions)
  │       └── test.jsonl (121 questions)
  ├── processed/
  │   ├── jee_main_pyqs_normalized.jsonl
  │   └── jee_main_pyqs_summary.json
  ├── metadata/
  │   ├── README.md
  │   ├── source_README.md
  │   ├── audit_report.json
  │   └── coverage_matrix.md
  └── README.md
  ```

---

## 2. Quantitative Summary

| Subject | Train Split | Test Split | Total Raw Questions | Papers Covered |
| :--- | :--- | :--- | :--- | :--- |
| **Chemistry** | 627 | 111 | **738** | 28 Papers (`CH-01` to `CH-28`) |
| **Physics** | 652 | 116 | **768** | 28 Papers (`P-01` to `Ph-28`) |
| **Mathematics** | 680 | 121 | **801** | 28 Papers (`M-01` to `M-28`) |
| **Total** | **1,959** | **348** | **2,307** | **84 Subject Paper Sets** |

---

## 3. Coverage, Sessions, and Shifts

The dataset contains 28 distinct paper sets per subject (84 total subject paper sets), including:
- Official JEE Main session papers (including 2020 sessions: August 2020 Session, October/November/December sessions, and January shifts).
- Complete subject-wise mock and previous-year test papers aligned with the official NTA JEE Main question format:
  - **Single-Correct MCQs** (4 options A, B, C, D) with negative marking scheme (+4 / -1).
  - **Numerical Value Questions** (integer / decimal responses) matching Section B of NTA pattern.
- High-fidelity mathematical and chemical LaTeX markup, preserving subscripts, superscripts, vectors, matrices, and formulas.

---

## 4. Known Limitations & Edge Cases

1. **Answer Keys**: The vast majority (>95%) of questions possess complete, verified answer keys. Early historical practice papers without distinct answer keys retain full step-by-step solutions from which the correct answer is derived.
2. **Difficulty Labels**: Stated difficulty labels in the raw source contain typographical variants (e.g. `Easy / Moderate`, `Modertae`, `Tough`). The normalization pipeline standardizes these into `Easy`, `Medium`, and `Hard`.
3. **Diagrams**: Questions and solutions with graphical elements refer to converted PNG assets. The pipeline stores image paths and cloud CDN fallbacks (`https://huggingface.co/datasets/soughed/jee-main-questions/resolve/main/...`).
4. **Historical Years**: While 28 complete multi-subject papers are available, metadata dates span 2020–2024 sessions; earlier years (2016–2019) or specific shift metadata in legacy files are categorized under their verified paper tags.

---

## 5. Licensing & Permitted Usage

- **Creative Commons Attribution 4.0 International (CC-BY-4.0)**:
  - **Sharing & Adaption**: Free to copy, redistribute, transform, and build upon for any purpose, including academic, commercial, and educational applications.
  - **Attribution Requirement**: Credit the original author (`soughed / eQOURSE`), link to the license, and indicate any modifications made.
  - **Academic Software Exemption**: Fully compliant with educational capstone and final-year university research project requirements. No proprietary scraping, credentials bypass, or paywalled access was used.
