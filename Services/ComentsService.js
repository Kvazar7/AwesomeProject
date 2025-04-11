import { db } from '../Сonfig/firebaseConfig';
import { collection, query, where, addDoc, onSnapshot, getCountFromServer } from 'firebase/firestore';

// export const getCommentsForPost = async (postId) => {
//     const commentsRef = collection(db, 'comments');
//     const q = query(commentsRef, where('postId', '==', postId));
//     const querySnapshot = await getDocs(q);
//     const comments = [];
//     querySnapshot.forEach((doc) => {
//         comments.push({ id: doc.id, ...doc.data() });
//     });
// return comments;
// };

export const addCommentToPost = async (comment) => {
    const commentsRef = collection(db, 'comments');
    await addDoc(commentsRef, {
        ...comment,
        createdAt: new Date().toISOString(), // Додаємо дату створення коментаря
    });
};

export const subscribeToComments = ( postId, callback ) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const comments = [];
    querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
    });
    // Сортуємо коментарі за датою у зворотному порядку
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(comments);
    });
    return unsubscribe;
};

export const getCommentCountForPost = async (postId) => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', postId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count; // Повертаємо кількість коментарів
};