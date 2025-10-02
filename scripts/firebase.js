//Importando los métodos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

//Métodos importados
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  orderBy,
  arrayRemove,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

//Configuraciones
const firebaseConfig = {
  apiKey: "AIzaSyBoA94OKaawQO_xaoZrloeHSIV5UO42C0I",
  authDomain: "linkup-79458.firebaseapp.com",
  projectId: "linkup-79458",
  storageBucket: "linkup-79458.firebasestorage.app",
  messagingSenderId: "337862907831",
  appId: "1:337862907831:web:d25b229814a63c257c7a32",
};

//Bases de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ¡¡¡ZONA DE MÉTODOS PARA EL MANEJO DE LA BASE DE DATOS!!! */

/* CUENTA Y LOGIN */

export const createAccount = async (user) => {
  try {
    const docRef = await addDoc(collection(db, "users"), user);
    //obtener key única
    const key = docRef._key.path.segments[1];
    console.log(docRef);
    console.log(key);
    console.log("Usuario creado");
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    // Referencia a la colección
    const usersRef = collection(db, "users");

    // Buscar usuario con ese email
    const myquery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(myquery);

    if (querySnapshot.empty) {
      // console.log("Usuario no encontrado");
      return null;
    }

    let userId = null;
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.password === password) {
        userId = doc.id; // esta es la llave del documento
      }
    });

    if (userId) {
      // console.log("Login exitoso, id:", userId);
      return userId;
    } else {
      // console.log("Contraseña incorrecta");
      return null;
    }
  } catch (error) {
    // console.error("Error en login:", error);
    return null;
  }
};

/* ADMINISTRAR USUARIOS*/

export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Usuario encontrado");
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log("Usuario no encontrado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};

export const addFriend = async (currentUserId, friendId) => {
  try {
    const userRef = doc(db, "users", currentUserId);
    await updateDoc(userRef, {
      friends: arrayUnion(friendId),
    });
  } catch (error) {
    console.error("Error al agregar friend:", error);
    throw error;
  }
};

export const removeFriend = async (currentUserId, friendId) => {
  try {
    const userRef = doc(db, "users", currentUserId);
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    });
  } catch (error) {
    console.error("Error al eliminar friend:", error);
    throw error;
  }
};

/* ADMINISTRAR POSTS */

export const createPost = async (post) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), post);
    //obtener key única
    const key = docRef.id;
    console.log(docRef);
    console.log(key);
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async () => {
  console.log("Obteniendo Post...");
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return posts;
};

export const getPostsByDate = async () => {
  console.log("Obteniendo Post ordenados por fecha...");
  const q = query(
    collection(db, "posts"),
    orderBy("date", "desc") // 👈 desc = más nuevos primero
  );

  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return posts;
};

export const getPostsByUser = async (userId) => {
  try {
    console.log("Obteniendo posts del usuario:", userId);

    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("user_id", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    // posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
  } catch (error) {
    console.error("Error al obtener posts por usuario:", error);
    return [];
  }
};

export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayUnion(userId), // agrega userId si no existe
    });

    console.log(`Usuario ${userId} dio like al post ${postId}`);
  } catch (error) {
    console.error("Error al dar like:", error);
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      likes: arrayRemove(userId), // elimina userId si existe
    });

    console.log(`Usuario ${userId} quitó like al post ${postId}`);
  } catch (error) {
    console.error("Error al quitar like:", error);
  }
};
