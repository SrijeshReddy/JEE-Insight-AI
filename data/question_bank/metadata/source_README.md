---
license: cc-by-4.0
language:
- en
task_categories:
- question-answering
- multiple-choice
tags:
- education
- chemistry
- physics
- mathematics
- jee
- jee-main
- exam
- india
pretty_name: JEE Main Question Bank
configs:
- config_name: chemistry
  data_files:
  - split: train
    path: chemistry/train.jsonl
  - split: test
    path: chemistry/test.jsonl
- config_name: physics
  data_files:
  - split: train
    path: physics/train.jsonl
  - split: test
    path: physics/test.jsonl
- config_name: mathematics
  data_files:
  - split: train
    path: mathematics/train.jsonl
  - split: test
    path: mathematics/test.jsonl
---

# JEE Main — Question Bank

A structured dataset of **JEE Main** examination questions with full metadata,
worked solutions, and diagrams. Built for education, ML training, and
question-generation use cases.

**Subsets:**
- **Chemistry** — 738 questions from 28 papers
- **Physics** — 768 questions from 28 papers
- **Mathematics** — 801 questions from 28 papers

Over **2,300 questions** across the three core JEE subjects.

## Structure

Organised into **subsets by subject** and **splits** (train / test):

```
chemistry/          physics/           mathematics/
├── train.jsonl     ├── train.jsonl    ├── train.jsonl
├── test.jsonl      ├── test.jsonl     ├── test.jsonl
└── images/         └── images/        └── images/
```

Choose the subject from the **Subset** dropdown and the split from the
**Split** dropdown in the Dataset Viewer.

## Schema

| Field              | Type      | Description                                                       |
|--------------------|-----------|-------------------------------------------------------------------|
| `question_id`      | string    | Unique ID, e.g. `CH-14-Q1`, `P-05-Q1`, `M-10-Q3`.               |
| `question`         | string    | Question text. `[IMAGE]` marks where a diagram appears inline.    |
| `question_images`  | list[str] | Relative paths to images used in the question.                   |
| `option_1`…`4`     | string    | The four answer choices (empty for numerical questions).         |
| `correct_option`   | int/null  | Index (1–4) of the correct choice for single-correct questions.  |
| `numerical_answer` | str/null  | The numeric answer for integer/numerical questions.              |
| `solution`         | string    | Full worked solution. `[IMAGE]` marks inline figures.            |
| `solution_images`  | list[str] | Relative paths to images used in the solution.                   |
| `subject`          | string    | `Chemistry`, `Physics`, or `Mathematics`.                        |
| `topic`            | string    | e.g. `Physical Chemistry`, `Thermodynamics`, `Circles`.          |
| `subtopic`         | string    | e.g. `Electrochemistry`, `Cyclic process`.                       |
| `difficulty`       | string    | e.g. `Easy` / `Moderate` / `Tough` (where provided).             |
| `question_type`    | string    | `single_correct` / `numerical`.                                  |
| `has_image`        | bool      | Whether the question or solution contains a figure.              |
| `exam`             | string    | `JEE Main`.                                                       |
| `source_paper`     | string    | Original source paper reference.                                 |

## Images

Original `.emf` / `.wmf` vector figures have been converted to PNG and stored
under each subject's `images/` folder. Image fields hold relative paths
(e.g. `images/image5.png`).

## Coverage notes

- The large majority of questions include a verified answer key. A small number
  of the earliest papers were supplied without an answer key and are included
  for their questions and solutions.
- Topic / subtopic / difficulty metadata is present for most questions where the
  source paper provided it.
- Questions support both single-correct (4 options) and integer/numerical types.
- Answers are captured across several source conventions (numeric, letter A–D,
  integer, and answers embedded in the solution line).

## Loading

```python
from datasets import load_dataset
chem = load_dataset("eQOURSE/jee-main-questions", "chemistry")
phys = load_dataset("eQOURSE/jee-main-questions", "physics")
math = load_dataset("eQOURSE/jee-main-questions", "mathematics")
```
