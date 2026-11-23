const DB_NAME = 'biochem-lab-files'
const STORE = 'files'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function saveFile(id: string, file: Blob) {
  return run('readwrite', (s) => s.put(file, id))
}

export function getFile(id: string) {
  return run<Blob | undefined>('readonly', (s) => s.get(id))
}

export function deleteFile(id: string) {
  return run('readwrite', (s) => s.delete(id))
}

export function clearFiles() {
  return run('readwrite', (s) => s.clear())
}
