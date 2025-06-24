# Workflow Orchestrator & Animator

### ✅ Completed Features

These features are fully implemented, tested, and stable in the current version of the application.

**Core Functionality:**
-   **Workflow Visualization:** Renders a complete workflow diagram based on `nodes` and `connections` data.
-   **Animation Player:** Animates the flow of data/process through the workflow according to a defined `animationSequence`.
-   **Player Controls:** Fully functional `Play`, `Pause`, and `Reset` controls for the animation.
-   **Conditional Logic (Decisions):** The animator correctly pauses at `decision` nodes and presents a modal for user input to determine the workflow path.

**Interactive Editing:**
-   **Node Drag & Drop:** Users can freely reposition nodes on the canvas.
-   **Node Creation:** Users can add new nodes to the workflow.
-   **Node Deletion:** Users can select and delete nodes, which also removes associated connections.
-   **Node Label Editing:** Users can double-click any node to edit its text label in-place.
-   **Element Selection:** A clear visual indicator (glowing ring) shows the currently selected node.

**Customization & UX:**
-   **Multiple Themes:** Users can switch between several professional themes (`Midnight Sky`, `Emerald Dawn`, `Crimson Steel`).
-   **Variable Animation Speed:** Animation speed can be adjusted (`slow`, `normal`, `fast`).
-   **Multiple Animation Styles:** The visual representation of the animation can be changed (`Dot`, `Dotted Line`, `Packet`).
-   **Save & Load Workflow:** Users can save the entire workflow state (including node positions and logic) to a JSON file and load it back.

**Stability & Performance:**
-   **Crash-Free Animation:** The "Maximum update depth exceeded" error has been definitively resolved by decoupling the animation loop from the React lifecycle.
-   **Optimized Rendering:** Use of `React.memo` and a centralized Zustand store prevents unnecessary component re-renders.

---

### ⏳ Pending Features (Roadmap)

This section outlines the next steps for development, divided into core requirements and valuable enhancements.

####  Core Features

These are essential features required to make the workflow editor truly comprehensive.

| Feature | Description | Priority |
| :--- | :--- | :--- |
| **Connection Creation/Deletion** | Implement an "Add Connection" mode where a user can click two nodes to visually draw and save a new connection between them. Allow selection and deletion of connections. | **High** |
| **Edit Animation Sequence** | Create a UI (e.g., a re-orderable list in the sidebar) that allows the user to modify the `animationSequence`. This includes adding new steps, deleting steps, and changing their order to redefine the logical flow. | **High** |
| **Node Property Editor** | When a node is selected, show its properties (e.g., `type`, `label`) in the sidebar, allowing for more detailed editing than just the label. This would allow changing a "Process" node to a "Broker" node, for instance. | **Medium** |
| **Conditional Path Editor** | Allow users to edit the `label` on a connection (e.g., change "Yes" to "High-Risk") and link it to the options in a `decision` step within the animation sequence editor. | **Medium** |

#### Good-to-Have Features

These features would significantly enhance the user experience and professional appeal of the application.

| Feature | Description | Priority |
| :--- | :--- | :--- |
| **Canvas Pan & Zoom** | Implement panning (e.g., by holding Spacebar + drag) and zooming (e.g., with the mouse wheel) to allow users to navigate very large or complex workflows easily. | **High** |
| **Right-Click Context Menus** | Instead of relying solely on the sidebar, allow users to right-click on a node or connection to open a context menu with common actions like "Edit," "Delete," or "Add Connection." | **Medium** |
| **Snap-to-Grid / Alignment Guides** | Add visual guides or a background grid that nodes can "snap" to when being dragged, helping users create cleaner, more organized diagrams. | **Medium** |
| **Undo / Redo** | Implement an action history to allow users to undo or redo their last actions (e.g., moving a node, deleting a connection). | **Low** |
| **Multi-Node Selection** | Allow users to select multiple nodes (e.g., by holding `Shift` or drawing a selection box) to move or delete them as a group. | **Low** |
| **Pre-built Templates** | Add a dropdown to load different pre-built workflow examples (e.g., "Software Release Cycle," "Customer Onboarding") besides the default "Stock Market" one. | **Low** |

---------------

### I. Core Feature Enhancements: Workflow Editing

The application was transformed from a static viewer into an interactive editor.

| Feature | Description |
| :--- | :--- |
| **Node Drag & Drop** | Users can now click and drag any node on the canvas to reposition it. The new coordinates are saved to the global state, ensuring that connections update in real-time. |
| **Element Selection** | Clicking on a node now "selects" it, indicated by a theme-aware glowing outline. Clicking the background deselects it. This is the foundation for all editing actions. |
| **Add Node** | An "Editor" panel was added with a button to dynamically create a new "Process" node and add it to the center of the canvas. |
| **Delete Element** | Users can delete the currently selected node. This action also intelligently removes any connections that were attached to the deleted node. |
| **Label Editing** | Double-clicking a node's text allows for in-place editing of its label, which is saved on blur or by pressing `Enter`. |

### II. Stability & Bug Fixes

The most critical effort was to diagnose and permanently fix a recurring application crash.

| Bug Fix | Description |
| :--- | :--- |
| **"Maximum update depth exceeded" Crash (FIXED)** | This critical bug, which caused an infinite render loop, was resolved by a complete architectural refactoring. |
| &nbsp;&nbsp;&nbsp; _Old Architecture (Flawed)_ | The animation loop (`requestAnimationFrame`) was inside a React `useEffect`, and it updated component-local state. This created a high-frequency feedback loop where state updates triggered re-renders, which re-triggered the effect, leading to a crash. |
| &nbsp;&nbsp;&nbsp; _New Architecture (Stable)_ | The animation loop was moved into a **decoupled, plain JavaScript "Animation Manager" object** that lives outside the React component tree. This manager directly updates the global Zustand store. React components now only *subscribe* to this state. This architecture completely severs the feedback loop, ensuring stability. |
| **Robust Pause/Resume** | The pause functionality was stabilized. It now correctly saves the precise progress of the current animation segment to the global store, allowing it to resume seamlessly from the exact same point, even if settings like animation speed are changed while paused. |
| **Control Button Logic** | The Play/Pause buttons are now correctly `disabled` based on the application's state (e.g., Play is disabled while playing, Pause is disabled when paused), preventing invalid user actions. |
| **Drag & Drop Stability** | Fixed a minor issue where starting a drag on a node could accidentally trigger a background click, causing the node to be deselected. |

### III. UI/UX & Professional Refinements

The user interface and overall experience were significantly improved.

| Refinement | Description |
| :--- | :--- |
| **Reorganized Control Panel** | The sidebar controls were logically grouped into collapsible, icon-labeled sections: `Controls`, `Editor`, `Settings`, and `Theme & Data`, making the UI cleaner and more intuitive. |
| **Visual Selection Feedback** | The prominent glowing ring on selected nodes provides clear, unambiguous feedback to the user about what element is being targeted for editing. |
| **Load/Save Workflow** | Implemented the ability for users to save the current state of their workflow (including node positions) to a `.json` file and to load a workflow from a file, enabling persistence and sharing. |
- **Multiple Professional Themes** | Added two new themes (`Emerald Dawn`, `Crimson Steel`) alongside the original `Midnight Sky`. Users can switch between them instantly for different visual aesthetics. |
| **Enhanced Animation Styles** | Users can choose between three distinct animation visualizations: a moving `Dot`, a `Dotted Line`, or a data `Packet` icon, providing richer visual options. |

### IV. Performance & Code Quality

The underlying codebase was optimized for better performance and maintainability.

| Optimization | Description |
| :--- | :--- |
| **Centralized State Management (Zustand)** | All application state (workflow data, player state, UI settings, and real-time animation progress) is now managed in a single, authoritative Zustand store. This simplifies state logic and decouples components. |
| **Component Memoization** | All child components (`WorkflowNode`, `WorkflowDisplay`, etc.) are wrapped in `React.memo` to prevent unnecessary re-renders when their props have not changed. |
| **Decoupled Animation Logic** | As described in the bug fix section, moving the animation loop out of React's lifecycle is also a major performance win, as it prevents the entire component tree from re-rendering 60 times per second during an animation. |
| **Step-by-Step Debuggable Code** | The final version of the code was structured with heavily commented sections (`STEP 1`, `STEP 2`, etc.) to allow a developer to enable features one by one, making it easy to diagnose any future issues by isolating the problematic feature. |
