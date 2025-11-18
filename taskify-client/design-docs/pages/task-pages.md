# Task Management Pages Design

## HomePage.tsx

**Purpose**: Display all user tasks with filtering, sorting, and pagination

**Required Components**:

- **table** (standard) - Display tasks list
- **button** (standard) - Create task, pagination controls
- **select** (standard) - Filter and sort dropdowns
- **pagination** (standard) - Navigate pages
- **badge** (standard) - Task status indicators
- **card** (standard) - Container for table

**Layout**:

- Header with "Create Task" button
- Filter controls (status, sort by)
- Tasks table with columns: title, description, due date, status
- Pagination controls at bottom

**Functionality**:

- useTasks hook with filtering/pagination params
- useUser hook to get current user
- useLogout hook for logout button
- Open CreateTaskDialog on button click

---

## ViewTaskPage.tsx

**Purpose**: Display single task details with edit/delete actions

**Required Components**:

- **card** (standard) - Container for task details
- **button** (standard) - Update and delete buttons
- **badge** (standard) - Task status
- **separator** (standard) - Visual divider

**Layout**:

- Task title as heading
- Task description
- Due date display
- Status badge
- Action buttons (Update, Delete)

**Functionality**:

- useTask hook to fetch task by ID
- Open UpdateTaskDialog on update button
- Open DeleteTaskDialog on delete button

---

**User will choose Level 3 pattern numbers from kibo-ui.com**
