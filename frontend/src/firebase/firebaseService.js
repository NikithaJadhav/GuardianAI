// Firebase Service - Authentication & Firestore Operations
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ==================== AUTHENTICATION ====================

export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ==================== FIRESTORE - USERS ====================

export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== FIRESTORE - EMERGENCY CONTACTS ====================

export const createContact = async (userId, contactData) => {
  try {
    const contactsRef = collection(db, 'contacts');
    const newContact = {
      userId,
      name: contactData.name,
      phone_number: contactData.phone_number,
      relationship: contactData.relationship,
      email: contactData.email || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(contactsRef, newContact);
    return { success: true, data: { id: docRef.id, ...newContact } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserContacts = async (userId) => {
  try {
    const contactsRef = collection(db, 'contacts');
    const q = query(
      contactsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const contacts = [];
    querySnapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: contacts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getContactById = async (contactId) => {
  try {
    const docRef = doc(db, 'contacts', contactId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Contact not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateContact = async (contactId, contactData) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await updateDoc(contactRef, {
      ...contactData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteContact = async (contactId) => {
  try {
    await deleteDoc(doc(db, 'contacts', contactId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
