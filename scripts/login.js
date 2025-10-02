import {
  createAccount,
  loginUser,
  createPost,
  getPosts,
  getUserById,
} from "./firebase.js";

/* ZONA EN DESARROLLO, ESTA PANTALLA POR AHORA ES PARA PRUEBAS */

//Método para crear un usuario (pantalla de registarse)
const createUser = (
  name,
  username,
  email,
  password,
  description = "Hola, estoy usando LinkUp!",
  profile_pic = "https://res.cloudinary.com/diogirqun/image/upload/v1759378125/usuario_mswads.png",
  bio_pic = "https://res.cloudinary.com/diogirqun/image/upload/v1759378247/luke-chesser-pJadQetzTkI-unsplash_mpmrjs.jpg"
) => {
  let user = {
    name: name,
    username: username,
    email: email,
    password: password,
    description: description,
    friends: [],
    profile_pic: profile_pic,
    bio_pic: bio_pic,
  };

  createAccount(user);
};

//Crear un post (pantalla de create)
const userPost = (user_id, description, picture) => {
  const fecha = new Date();
  let post = {
    user_id: user_id,
    description: description,
    picture: picture,
    likes: [],
    comments: [],
    date: fecha,
  };

  createPost(post);
};

createUser(
  "Michael Scott",
  "michael.scott.the.real",
  "michael@gmail.com",
  "1234"
);

//Método para logearse (pantalla de login)
const login = async (email, password) => {
  console.log("Hola");
  let id = await loginUser(email, password);
  let usuario = await getUserById(id);
  if (id != null) {
    console.log(id);
    //Limpiamos por si había una sesión
    localStorage.clear();

    //Guardamos id y datos del usuario para usarlos más tarde
    localStorage.setItem("idUsuario", id);
    localStorage.setItem("infoUsuarioActual", JSON.stringify(usuario));
  } else {
    console.log("Email o contraseña erroneos");
  }
};

//Método que recibe los post de todos (Si puede estar aquí)
const cargarPosts = async () => {
  let posts = await getPosts();
  console.log(posts);
};

//

console.log("Hola");
login("michael@gmail.com", "1234");
//cargarPosts();
