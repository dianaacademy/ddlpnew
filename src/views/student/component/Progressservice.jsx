// progressService.js
import { db, auth } from '@/firebase.config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Function to mark a chapter as complete
export const markChapterAsComplete = async (courseId, chapterId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const progressRef = doc(db, `users/${userId}/progress/${courseId}`);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      completedChapters: arrayUnion(chapterId)
    });
  } else {
    await setDoc(progressRef, {
      completedChapters: [chapterId],
      lastVisitedChapter: chapterId
    });
  }
  
  // Return the updated chapter ID for local state updates
  return chapterId;
};

// Function to get completed chapters for a course
export const getCompletedChapters = async (courseId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const progressRef = doc(db, `users/${userId}/progress/${courseId}`);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    return progressSnap.data().completedChapters || [];
  } else {
    return [];
  }
};

// Function to set the last visited chapter
export const setLastVisitedChapter = async (courseId, chapterId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const progressRef = doc(db, `users/${userId}/progress/${courseId}`);
  const progressSnap = await getDoc(progressRef);
  
  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      lastVisitedChapter: chapterId
    });
  } else {
    await setDoc(progressRef, {
      completedChapters: [],
      lastVisitedChapter: chapterId
    });
  }
  
  // Return the updated chapter ID for local state updates
  return chapterId;
};

// Function to get the last visited chapter
export const getLastVisitedChapter = async (courseId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const progressRef = doc(db, `users/${userId}/progress/${courseId}`);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    return progressSnap.data().lastVisitedChapter || null;
  } else {
    return null;
  }
};