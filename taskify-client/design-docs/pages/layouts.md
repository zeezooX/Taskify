# Layout Components Design

## AuthLayout.tsx

**Purpose**: Layout wrapper for authentication pages (Login, Register)

**Required Components**:

- **card** (standard) - Container for auth content
- **separator** (standard) - Visual dividers

**Layout**:

- Centered layout with max-width
- Card container with padding
- Title area
- Content area for children
- Footer with links

**Functionality**:

- Accept title prop
- Render children content
- Responsive design

---

## MainLayout.tsx

**Purpose**: Layout wrapper for main application pages (Home, ViewTask)

**Required Components**:

- **navigation-menu** (standard) - Top navigation
- **button** (standard) - Logout button
- **avatar** (standard) - User avatar/icon

**Layout**:

- Top navigation bar with logo and user menu
- Main content area for children
- Logout button in navigation

**Functionality**:

- Display user email/info
- useUser hook for user data
- useLogout hook for logout action
- Render children content

---

## DialogLayout.tsx

**Purpose**: Wrapper for dialog components to manage open/close state

**Required Components**:

- **dialog** (standard) - Base dialog component

**Layout**:

- Dialog trigger (button or other element)
- Dialog content wrapper
- Children content

**Functionality**:

- Manage dialog open/close state
- Accept trigger element
- Handle dialog events

---

**User will choose Level 3 pattern numbers from kibo-ui.com**
