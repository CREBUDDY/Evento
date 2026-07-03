import { useUser } from '@/hooks/use-user';

export const useFirestore = () => null;
export const useCollection = () => ({ data: [], isLoading: false });
export const useDoc = () => ({ data: null, isLoading: false });
export const useMemoFirebase = (fn: any) => null;
export const errorEmitter = { on: () => {}, off: () => {} };
export class FirestorePermissionError extends Error {}
export const verifyAttendee = async () => {};
export const setDocumentNonBlocking = async () => {};

// Firebase native module stubs
export const doc = () => null;
export const setDoc = async () => {};
export const collection = () => null;
export const query = () => null;
export const where = () => null;
export const limit = () => null;
export const runTransaction = async () => {};
export const getDoc = async () => null;
export const getDocs = async () => ({ docs: [] });
export const updateDoc = async () => {};
export const addDoc = async () => {};
export const serverTimestamp = () => new Date();
export const useAuth = () => null;

export { useUser };
