# Team Task Manager - Demo Script (2-5 Minutes)

## 1. Introduction & Login (30s)
- **Action**: Open the application at `localhost:5173`.
- **Narrative**: "Welcome to the Team Task Manager. We'll start by logging in as an Admin user."
- **Action**: Enter Admin credentials and click 'Sign In'.
- **Narrative**: "Upon login, we're greeted with the Dashboard, which gives us a real-time summary of our team's performance."

## 2. Dashboard & Navigation (30s)
- **Narrative**: "The dashboard dynamically calculates stats like total, completed, and overdue tasks. The navigation sidebar allows us to jump between Projects, Tasks, and User Management."
- **Action**: Hover over the stat cards to show the hover effects.

## 3. Project Management (45s)
- **Action**: Navigate to 'Projects'.
- **Narrative**: "As an Admin, I have the authority to create new projects."
- **Action**: Click 'New Project', enter 'Project X', and click 'Create'.
- **Narrative**: "The project is created instantly and added to the grid. Note that if I were a regular Member, this 'New Project' button would be hidden, enforcing our RBAC policy."

## 4. Task Creation & Assignment (45s)
- **Action**: Navigate to 'Tasks'.
- **Narrative**: "Now let's assign a task. I'll create a new task for our new project."
- **Action**: Click 'New Task'. Select 'Project X', enter 'Final Review' as title, and pick a deadline.
- **Narrative**: "I can set a deadline and assign it. For this demo, tasks are auto-assigned to the creator to ensure immediate tracking."
- **Action**: Click 'Create' and show the task appearing in the list.

## 5. Status Updates & Overdue Tracking (30s)
- **Action**: Change the status of the new task to 'In Progress' via the dropdown.
- **Narrative**: "Task statuses can be updated on the fly. If a task passes its deadline, the system automatically flags it as overdue with a visual warning."

## 6. User Management (Admin Only) (30s)
- **Action**: Navigate to 'User Management'.
- **Narrative**: "Finally, as an Admin, I can manage the entire team. I can see all registered users and promote or demote roles with a single click."
- **Action**: Change a user's role from Member to Admin and back.

## 7. Conclusion (15s)
- **Narrative**: "This completes the walkthrough of the Team Task Manager—a secure, scalable, and role-aware solution for team collaboration."
- **Action**: Click 'Logout'.
