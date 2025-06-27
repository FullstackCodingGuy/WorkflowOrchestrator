# Feature Request: Implement "Export & Share" Functionality

## 1. User Story

As a user of the Workflow Orchestrator, I want to be able to export my created diagrams into various formats (SVG, PNG, JPEG, PDF, GIF) and share them easily, so that I can use them in presentations, documentation, or collaborate with others.

## 2. Functional Requirements

### 2.1. Export Button

-   An "Export & Share" button should be added to the main `DiagramToolbar`.
-   Clicking this button should open a popup/modal menu.

### 2.2. Export Popup Menu

-   The popup should be a medium-sized, non-blocking modal.
-   It must contain clear options for each export format.

### 2.3. Export Formats

The following export formats must be supported:

-   **SVG:** Export the diagram as a scalable vector graphic.
-   **PNG:** Export as a high-quality raster image with transparency.
-   **JPEG:** Export as a raster image (useful for smaller file sizes).
-   **PDF:** Export the diagram as a document, suitable for printing or embedding.
-   **GIF:** Export an animated GIF of the workflow, if the workflow type supports animation.

### 2.4. Export Logic

-   The export functionality should capture the current state of the diagram from the ReactFlow instance.
-   It should handle the conversion to the selected format using appropriate libraries (`html-to-image`, `jspdf`, `gif.js`).
-   The exported file should be downloaded to the user's machine with a sensible filename (e.g., `workflow-export-YYYY-MM-DD.png`).

## 3. Non-Functional Requirements

-   **Loose Coupling:** The export feature should be implemented in a way that it does not tightly couple with other components. Use of a state management store (Zustand) to manage actions is preferred.
-   **Extensibility:** The architecture should make it easy to add new export formats or sharing options in the future.
-   **Maintainability:** The code should be clean, well-commented, and organized into logical modules/components.
-   **Performance:** The export process should be reasonably fast and not block the UI for an extended period, especially for large diagrams.
-   **Robustness:** The feature should not introduce any regressions or break existing application functionality.

## 4. UI/UX Details

-   **Toolbar Button:** A new icon button for "Export & Share" in `DiagramToolbar.tsx`.
-   **Popup Menu (`ExportShareMenu.tsx`):**
    -   A clean, modern design.
    -   Use icons (`@tabler/icons-react`) for each export option to make it intuitive.
    -   A close button (`X`) to dismiss the menu.
    -   A brief description or tooltip for each option could be helpful.

## 5. Suggested Technical Implementation

-   **State Management (`workflowStore.ts`):**
    -   Define an `ExportActions` interface in the Zustand store.
    -   Add `exportActions` and `setExportActions` to the store's state and actions to hold the export functions.
-   **Logic Encapsulation (`useWorkflowExport.ts`):**
    -   Create a custom hook to contain all the logic for exporting to different formats. This hook will use libraries like `html-to-image` and `jspdf`.
-   **UI Component (`ExportShareMenu.tsx`):**
    -   A new React component for the popup menu UI.
    -   This component will get the export functions from the `workflowStore`.
-   **Integration (`ExportManager.tsx`):**
    -   Create a non-visual component that uses the `useWorkflowExport` hook and registers the export functions with the `workflowStore` via `setExportActions`.
    -   This `ExportManager` component should be rendered within the main `DiagramEditor.tsx` to ensure the actions are always available when the editor is active.
-   **Toolbar Integration (`DiagramToolbar.tsx`):**
    -   The toolbar will trigger the display of the `ExportShareMenu`.
    -   The `ExportShareMenu` will then use the actions from the store to perform the exports, avoiding prop drilling.

## 6. Acceptance Criteria

-   [ ] The "Export & Share" button is present in the main toolbar.
-   [ ] Clicking the button opens the export menu.
-   [ ] The menu can be closed.
-   [ ] The diagram can be successfully exported as an SVG file.
-   [ ] The diagram can be successfully exported as a PNG file.
-   [ ] The diagram can be successfully exported as a JPEG file.
-   [ ] The diagram can be successfully exported as a PDF file.
-   [ ] The diagram can be successfully exported as a GIF file (for animated workflows).
-   [ ] The implementation is decoupled using the Zustand store.
-   [ ] The code is well-structured and follows the suggested implementation plan.
-   [ ] No existing features are broken.

## 7. Future Improvements & Refactoring (Jira-Style Stories)

### Story 1: Centralize Application State in Zustand Store

*   **As a developer,** I want to refactor the application to centralize all shared state in the `workflowStore`,
*   **so that** I can improve state predictability, reduce prop drilling, and make the codebase easier to maintain and debug.

**Acceptance Criteria:**
*   All shared state (e.g., theme, diagram state, UI visibility) is managed in `workflowStore.ts`.
*   Components select their required state and actions directly from the store.
*   Prop drilling for state management is eliminated.
*   The application's functionality remains unchanged.

### Story 2: Refactor Large Components into Smaller, Reusable Modules

*   **As a developer,** I want to break down large components like `DiagramEditor` and `DiagramToolbar` into smaller, more focused sub-components,
*   **so that** I can improve reusability, testability, and overall code readability.

**Acceptance Criteria:**
*   `DiagramEditor.tsx` is refactored into smaller components (e.g., `Canvas`, `EditorUI`).
*   `DiagramToolbar.tsx` is broken down into smaller, single-purpose button/control components.
*   The application's UI and functionality remain consistent.

### Story 3: Enhance Export Functionality with Custom Settings

*   **As a user,** I want to be able to customize export settings, such as image resolution, PDF orientation, and GIF frame rate,
*   **so that** I can have more control over the output for different use cases.

**Acceptance Criteria:**
*   The `ExportShareMenu` includes UI controls for customizing export options.
*   The `ExportManager` can accept and apply these custom settings during the export process.
*   The exported file reflects the selected custom settings.

### Story 4: Implement a Unified Notification System

*   **As a user,** I want to receive clear and consistent feedback for my actions, such as "Export successful" or "Failed to save workflow,"
*   **so that** I have a better understanding of the application's status and can react accordingly.

**Acceptance Criteria:**
*   A centralized notification system (e.g., using a toast library) is implemented.
*   All user actions that require feedback (e.g., export, save, delete) trigger a notification.
*   Notifications are displayed in a consistent and non-intrusive manner.
