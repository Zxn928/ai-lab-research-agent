import { openDB } from 'idb';
import { createEmptyWorkspaceState, type WorkspaceState } from '../types/workspace';

const DB_NAME = 'ai-lab-research-agent';
const STORE_NAME = 'workspace';
const WORKSPACE_KEY = 'current';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  }
});

export async function loadWorkspace(): Promise<WorkspaceState> {
  const db = await dbPromise;
  const saved = await db.get(STORE_NAME, WORKSPACE_KEY);
  return saved || createEmptyWorkspaceState();
}

export async function saveWorkspace(state: WorkspaceState) {
  const db = await dbPromise;
  await db.put(
    STORE_NAME,
    {
      ...state,
      updatedAt: new Date().toISOString()
    },
    WORKSPACE_KEY
  );
}

export async function clearWorkspace() {
  const db = await dbPromise;
  await db.delete(STORE_NAME, WORKSPACE_KEY);
}
