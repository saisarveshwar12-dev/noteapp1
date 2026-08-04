/* ============================================================================
   To-Do List JavaScript Logic (script.js)
   Firebase Firestore Integration using Async/Await & Modular SDK
   ============================================================================ */

import { 
    db, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp 
} from "./firebase.js";

// --------------------------------------------------------------------------
// 1. DOM Elements Selection
// --------------------------------------------------------------------------
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskStats = document.getElementById('taskStats');
const submitBtn = document.getElementById('submitBtn');

// Collection Reference for Firestore
const TASKS_COLLECTION = 'tasks';
const tasksRef = collection(db, TASKS_COLLECTION);

// --------------------------------------------------------------------------
// 2. Real-time Listener (Retrieve Tasks from Firestore automatically)
// --------------------------------------------------------------------------
// Query tasks ordered by creation time descending (newest first)
const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));

// Listen for live Firestore updates
onSnapshot(tasksQuery, (snapshot) => {
    const tasks = [];
    snapshot.forEach((docSnap) => {
        tasks.push({
            id: docSnap.id,
            ...docSnap.data()
        });
    });

    renderTasks(tasks);
}, (error) => {
    console.error("Error fetching tasks from Firestore: ", error);
    // Alert user if Firebase credentials are not yet configured
    if (error.code === 'permission-denied' || error.message.includes('API key')) {
        alert("Please configure your Firebase credentials in firebase.js!");
    }
});

// --------------------------------------------------------------------------
// 3. Add New Task (Async/Await)
// --------------------------------------------------------------------------
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task description before submitting.');
        return;
    }

    try {
        // Disable submit button while saving
        submitBtn.disabled = true;

        // Add task document to Firestore 'tasks' collection
        await addDoc(tasksRef, {
            task: taskText,
            completed: false,
            createdAt: serverTimestamp()
        });

        // Reset input field
        taskInput.value = '';
        taskInput.focus();
    } catch (error) {
        console.error("Failed to add task: ", error);
        alert("Error adding task. Check your Firebase config or console logs.");
    } finally {
        submitBtn.disabled = false;
    }
});

// --------------------------------------------------------------------------
// 4. Mark Task as Completed (Async/Await)
// --------------------------------------------------------------------------
/**
 * Toggles completed status of a task document in Firestore
 * @param {string} taskId - Unique Firestore Document ID
 * @param {boolean} currentStatus - Current completed boolean status
 */
async function toggleTaskCompleted(taskId, currentStatus) {
    try {
        const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
        await updateDoc(taskDocRef, {
            completed: !currentStatus
        });
    } catch (error) {
        console.error("Failed to update task status: ", error);
        alert("Error updating task status.");
    }
}

// --------------------------------------------------------------------------
// 5. Delete Task (Async/Await)
// --------------------------------------------------------------------------
/**
 * Deletes a task document from Firestore
 * @param {string} taskId - Unique Firestore Document ID
 */
async function deleteTask(taskId) {
    try {
        const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(taskDocRef);
    } catch (error) {
        console.error("Failed to delete task: ", error);
        alert("Error deleting task.");
    }
}

// --------------------------------------------------------------------------
// 6. UI Rendering & DOM Updates
// --------------------------------------------------------------------------
/**
 * Renders array of task objects into DOM
 * @param {Array} tasks - List of task objects from Firestore
 */
function renderTasks(tasks) {
    taskList.innerHTML = '';

    // Check if task list is empty
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Calculate completed statistics
    const completedCount = tasks.filter(t => t.completed).length;
    taskStats.textContent = `${completedCount} of ${tasks.length} completed`;

    // Render each task item
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <div class="task-left">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    aria-label="Toggle completed status"
                >
                <span class="task-text"></span>
            </div>
            <button class="delete-btn" title="Delete Task" aria-label="Delete Task">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        // Safely insert task text to prevent XSS
        const taskTextSpan = li.querySelector('.task-text');
        taskTextSpan.textContent = task.task || '';

        // Checkbox listener to toggle completion
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            toggleTaskCompleted(task.id, task.completed);
        });

        // Delete button listener
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });
}
