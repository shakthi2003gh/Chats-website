import { toast } from "react-toastify";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

async function uploadTemplate(storage, image) {
  return uploadBytes(storage, image)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .catch((error) => {
      if (error.code === "storage/unauthorized")
        toast.error("Unauthorized to upload image");
      else console.error(error);

      throw error;
    });
}

export async function uploadProfile(profileName, image) {
  const storageRef = ref(storage, "profile/" + profileName);

  return uploadTemplate(storageRef, image);
}

export async function uploadMessageImage(chat_id, image) {
  const storageRef = ref(storage, `chat/${chat_id}/message-${Date.now()}`);

  return uploadTemplate(storageRef, image);
}
