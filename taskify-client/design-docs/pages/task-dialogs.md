# Task Dialog Components Design

## CreateTaskDialog.tsx

**Purpose**: Modal dialog for creating a new task

**Required Components**:

- **dialog** (standard) - Modal container
- **form** (validation) - Form with validation
- **input** (standard) - Title input
- **textarea** (standard) - Description input
- **calendar** (standard) - Due date picker
- **button** (standard) - Submit and cancel buttons
- **label** (standard) - Form labels

**Layout**:

- Dialog with title "Create Task"
- Form fields: title (required), description (optional), due date (optional)
- Action buttons: Cancel, Create

**Functionality**:

- React Hook Form with createTaskSchema (Zod)
- useCreateTask hook
- Close dialog on success or cancel

---

## UpdateTaskDialog.tsx

**Purpose**: Modal dialog for updating an existing task

**Required Components**:

- **dialog** (standard) - Modal container
- **form** (validation) - Form with validation
- **input** (standard) - Title input
- **textarea** (standard) - Description input
- **calendar** (standard) - Due date picker
- **checkbox** (standard) - Completed status
- **button** (standard) - Submit and cancel buttons
- **label** (standard) - Form labels

**Layout**:

- Dialog with title "Update Task"
- Pre-filled form fields with current task data
- Completed checkbox
- Action buttons: Cancel, Update

**Functionality**:

- React Hook Form with updateTaskSchema (Zod)
- useUpdateTask hook
- Pre-populate form with task data
- Close dialog on success or cancel

---

## DeleteTaskDialog.tsx

**Purpose**: Confirmation dialog for task deletion

**Required Components**:

- **dialog** (standard) - Modal container
- **alert-dialog** (destructive) - Confirmation alert
- **button** (destructive) - Delete button
- **button** (standard) - Cancel button

**Layout**:

- Alert dialog with warning message
- Task title display
- Confirmation text
- Action buttons: Cancel, Delete

**Functionality**:

- useDeleteTask hook
- Close dialog on success or cancel
- Show task title in confirmation message

---

**User will choose Level 3 pattern numbers from kibo-ui.com**
