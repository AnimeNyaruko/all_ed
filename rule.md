### Update Mode

Standardized process for updating, optimizing, and pushing a new version to Git.

```mermaid
flowchart TD
    subgraph "Step 1: Scan and Propose Changes"
        A1[Scan @app directory] --> A2[Propose Refactoring]
        A2 --> A3[Wait for Approval]
        A3 -->|Approved| A4[Implement Refactoring]

        A4 --> B1[Propose Optimization]
        B1 --> B2[Wait for Approval]
        B2 -->|Approved| B3[Implement Optimization]

        B3 --> C1[Check Linting]
        C1 --> C2[Propose Fixes]
        C2 --> C3[Wait for Approval]
        C3 -->|Approved| C4[Implement Fixes]
    end

    subgraph "Step 2: Update Memory Bank"
        D1[Read Memory Bank] --> D2[Update Files]
    end

    subgraph "Step 3: Git Commit & Push"
        E1[Draft Git Commit] --> E2[Present for Approval]
        E2 -->|Approved| E3[Push to Repository]
    end

    subgraph "Step 4: Update version.json"
        F1[Request Timestamp] --> F2[Create New Version]
        F2 --> F3[Update Information]
    end

    A1 --> A2 --> A3 --> A4 --> B1 --> B2 --> B3 --> C1 --> C2 --> C3 --> C4 --> D1 --> D2 --> E1 --> E2 --> E3 --> F1 --> F2 --> F3
```

## Detailed Process:

# 1. Scan `@app`, Propose, and Implement Changes (After Approval):

- **Critical Requirement:** All proposed changes (refactoring, optimization, and linting) **MUST NOT** affect existing functionality unless absolutely necessary. Any potential change to functionality must be explicitly highlighted and requires specific approval.
- **Strict Consent Protocol:** No changes should be implemented without explicit user consent. Each stage (refactoring, optimization, linting) requires separate approval, and implementation must wait until consent is received.

- **Refactor:** Scan the `app/` directory to identify code refactoring opportunities to improve readability and structure. List the files and propose specific changes. All refactoring proposals must preserve existing functionality.
- **Optimize:** Analyze code within `app/` to find performance optimization points. List files and propose changes, _clearly noting if a proposal might affect existing functionality_. Prioritize optimizations that maintain full compatibility with current behavior.
- **Lint:** Run the linter on the entire project. Use Context7 to query the latest information about "Linting when Deploying NextJS Framework Project". Based on linter results and Context7 guidance, propose fixes. List files and propose fixes, _clearly noting if a proposal might affect existing functionality_.
- **Overall Review:** Present a consolidated list of all proposed changes (from Refactor, Optimize, Lint) for user review. Changes affecting functionality should be highlighted and specifically marked for special attention.
- **Implement:** After receiving _general_ user approval for the entire list of proposals, proceed to apply all approved code changes. If approval is partial, implement only the specifically approved changes.

# 2. Update Memory Bank:

After completing the code changes, update **all** files within the `memory-bank/` directory (following the defined `Update Documentation` process) to reflect the latest state of the code and project. Pay special attention to `activeContext.md` and `progress.md`.

# 3. Git Commit & Push:

- Stage all implemented changes (including code and memory bank).
- Draft a detailed commit message clearly describing _all_ changes made in the preceding steps (refactor, optimize, lint fixes, memory bank updates).
- **Review Commit Message:** Present the drafted commit message to the user for review and approval.
- **Execute Git:** After user approval of the commit message, execute `git commit` with that message and `git push` to the remote repository.

# 4. Update `version.json`:

- Request the user to provide the exact timestamp when the `git push` command in step 3 completed successfully (e.g., `Sat May 3 16:26:25 2025 +0700`).
- Open the `version.json` file.
- Create a **new version entry** in the JSON array. This entry should follow the structure of previous entries.
- Fill in the fields for the new entry:
  - `version`: Calculate the next version (e.g., if the last was "beta 1.3", the new one is "beta 1.4").
  - `final_release_date`: Set to the timestamp provided by the user.
  - `pre_release_date`: Set to the timestamp provided by the user.
  - `final_git_commit_message`: Set to the commit message approved in step 3.
  - `pre_git_commit_message`: Set to the commit message approved in step 3.
- Save the `version.json` file.

---

### Re-update Mode {number}

Process for handling minor updates or preparing bug fixes after an "update mode".

## `re-update mode 1` (Bug Fix Preparation)

```mermaid
flowchart TD
    A[Receive Bug Report] --> B[Analyze Bug]
    B --> C[Develop Fix Plan]
    C --> D[Present Plan]
    D --> E[Wait for "act mode"]
```

**Purpose:** Analyze and plan the fix for a specific user-reported bug.

1. **Receive Request:** The user activates this mode and provides a detailed description of the bug to be fixed (e.g., reproduction steps, expected vs. actual behavior, error messages if any).
2. **Analyze & Plan:**
   - Based on the bug description and information in the Memory Bank (especially `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`), analyze the root cause of the bug.
   - Develop a detailed fix plan, including the steps to be taken, files to be modified, and potential impacts (if any) on other parts of the system.
3. **Present Plan:** Present the developed fix plan to the user for review.
4. **Await Execution:** **Stop.** Do not implement the plan immediately. Wait for the user's next "act mode" command to begin implementing this fix plan.

## `re-update mode 2` (Update Current Version)

```mermaid
flowchart TD
    subgraph "Steps 1-3: Same as update mode"
        A1[Scan @app] --> A2[Propose Changes]
        A2 --> A3[Implement Changes]
        A3 --> A4[Update Memory Bank]
        A4 --> A5[Git Commit & Push]
    end

    subgraph "Step 4: Key Difference"
        B1[Request New Timestamp] --> B2[Open version.json]
        B2 --> B3[Identify Current Version]
        B3 --> B4[Update Only 2 Fields]
        B4 --> B5[Save File]
    end

    A1 --> A2 --> A3 --> A4 --> A5 --> B1 --> B2 --> B3 --> B4 --> B5
```

**Purpose:** Implement additional changes and update the commit/release date information for the _latest existing_ version in `version.json` (typically used after hotfixes or minor changes that didn't warrant a new version).

1. **Scan `@app`, Propose, and Implement Changes:** Execute **exactly** like Step 1 of "update mode".

   - Scan for Refactor, Optimize, Lint opportunities.
   - Present the consolidated proposals for user review.
   - **Re-request confirmation** from the user for these proposals, even if they are identical to a previous scan.
   - Implement the approved changes.

2. **Update Memory Bank:** Execute **exactly** like Step 2 of "update mode". Update the memory bank to reflect the latest code changes.

3. **Git Commit & Push:** Execute **exactly** like Step 3 of "update mode".

   - Stage changes.
   - Draft a **new** commit message describing the changes made _only during this specific `re-update mode 2` run_.
   - Present the **new** commit message for user approval.
   - Execute `git commit` and `git push` after approval.

4. **Update `version.json` (Key Difference):**
   - Request the user to provide the exact timestamp when the _latest_ `git push` (from step 3 of this `re-update mode 2` run) completed successfully.
   - Open the `version.json` file.
   - Identify the JSON entry corresponding to the **latest existing version** in the file.
   - **Do not create a new entry.**
   - Update **only** two fields in that existing entry:
     - `final_release_date`: Set to the _new_ timestamp provided by the user.
     - `final_git_commit_message`: Set to the _new_ commit message approved in step 3 of this `re-update mode 2` run.
   - Save the `version.json` file.
