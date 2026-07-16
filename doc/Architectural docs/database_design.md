# 🗄️ Database Design

This document details the database schema and layout configured inside **Supabase (PostgreSQL)** for the exam evaluation system.

---

## 🧬 Entity Relationship Diagram

The PostgreSQL database maintains a 1-to-many relationship between the exam paper templates and student evaluations.

```mermaid
erDiagram
    EXAM_PAPERS ||--o{ EVALUATIONS : has
    
    EXAM_PAPERS {
        uuid id PK
        text pdf_filename
        jsonb parsed_data
        timestamptz created_at
    }

    EVALUATIONS {
        uuid id PK
        uuid exam_paper_id FK
        text pdf_filename
        jsonb parsed_data
        text student_name
        text roll_number
        text exam_code
        text subject
        numeric obtained_marks
        numeric max_marks
        timestamptz created_at
    }
```

---

## 🗂️ Table Specifications

### 1. Table: `exam_papers`
This table stores the question paper structures, questions, marks distribution, and grading rubrics generated during ingestion.

| Field Name | PostgreSQL Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the exam paper. |
| `pdf_filename` | `TEXT` | `NOT NULL` | The original filename of the uploaded question paper PDF. |
| `parsed_data` | `JSONB` | `NOT NULL` | The complete structured JSON containing exam metadata, sections, questions list, marks, and rubrics (matches [question_paper_schema.md](./question_paper_schema.md)). |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Timestamp when the question paper was saved/compiled. |

---

### 2. Table: `evaluations`
This table stores the results of individual student answer sheet evaluations.

| Field Name | PostgreSQL Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for this evaluation record. |
| `exam_paper_id` | `UUID` | `FOREIGN KEY` references `exam_papers(id)` `ON DELETE CASCADE` | Associated question paper. If the exam paper is deleted, all its evaluations are removed automatically. |
| `pdf_filename` | `TEXT` | `NOT NULL` | Filename of the student's handwritten answer sheet. |
| `parsed_data` | `JSONB` | `NOT NULL` | The complete evaluated JSON detailing student metadata, marked answer blocks, matched criteria, marks, and diagrams (matches [answer_sheet_schema.md](./answer_sheet_schema.md)). |
| `student_name` | `TEXT` | - | The student's name extracted by AI (or manually corrected). |
| `roll_number` | `TEXT` | - | The student's roll number extracted by AI. |
| `exam_code` | `TEXT` | - | The subject/exam code extracted by AI. |
| `subject` | `TEXT` | - | The subject name extracted by AI. |
| `obtained_marks`| `NUMERIC` | - | Sum of all marks awarded to the student (dynamically calculated on saving). |
| `max_marks` | `NUMERIC` | - | The total potential marks of the exam paper template (for statistics). |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Timestamp when the answer sheet evaluation was completed. |

---

## ⚙️ Optimization & Gin Indexing

Since key metadata (such as roll numbers, subject, and student names) is extracted into the `parsed_data` JSONB columns, querying nested JSON structures using the standard `@>` (contains) operator is highly performant in PostgreSQL when using **GIN (Generalized Inverted Index)**.

If query volume grows, add the following indexes to your Supabase PostgreSQL instance:

```sql
-- Create a GIN index on the parsed_data JSONB column of evaluations for fast searching
CREATE INDEX idx_evaluations_parsed_data_gin ON public.evaluations USING gin (parsed_data);

-- Create a GIN index on the parsed_data JSONB column of exam_papers
CREATE INDEX idx_exam_papers_parsed_data_gin ON public.exam_papers USING gin (parsed_data);
```

---

## 🔒 Security Configuration (Row Level Security)

By default, RLS is disabled in [schema.sql](./schema.sql) for ease of local development setup:
```sql
ALTER TABLE public.exam_papers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations DISABLE ROW LEVEL SECURITY;
```

For staging and production environments, enable RLS to ensure teachers can only access their own exams:
```sql
-- Enable RLS
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Example policy: Only authenticated teachers can select/insert records
CREATE POLICY "Enable read access for authenticated users" 
ON public.exam_papers 
FOR SELECT 
TO authenticated 
USING (true);
```
