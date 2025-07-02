import {ref  , uploadBytesResumable , getDownloadURL} from 'firebase/storage'
import { storage } from './firebaseConfig'

export const uploadVideos = async(userId , file , type,) =>{
    const storageRef = ref(storage , `${type}/${userId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef ,  file);

    uploadTask.on(
        "state_changed", (snapshot)=>{
            // uploadLogic progress
        },
        (error)=>{
            console.error('upload error' , error);
        },
        async ()=>{
            const  downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
            return downloadUrl;
        }
    )
}