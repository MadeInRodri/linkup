/* ZONA DE VARIABLES DE MI CLOUDINARY */
const cloudName = "diogirqun";
const uploadPreset = "postsimages";

//MÉTODO QUE SUBE LA IMÁGEN Y DEVUELVE EL LINK
export const subirImagen = async (selectedFile) => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  const url = data.secure_url;
  return url;
};
