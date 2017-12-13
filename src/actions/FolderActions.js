import { OPEN_FOLDER_SUCCESS, OPEN_FOLDER_ERROR, CLOSE_FOLDER } from '../../../rtaa/src/constants/Folder';
import axios from 'axios';

export function openFolder(path) {//открыть папку. так же надо получить список файлов этой папки
    return (dispatch)=>{
        /*dispatch({
            type: 'OPEN_FOLDER',
            payload: 1
        })*/

        const token = /access_token=([^&]+)/.exec(document.location.hash)[1];
        axios.get('https://cloud-api.yandex.net/v1/disk/resources?path='+path, {//отправляем запрос на получение файлов в папке
            headers: {'Authorization': token}
        })
            .then(function (response) {
                let files = response.data._embedded.items;//файлы получены
                dispatch({
                    type: OPEN_FOLDER_SUCCESS,
                    payload: {files: files, path: path}
                })
            })
            .catch(function (error) {//произошла ошибка при получении списка файлов
                console.log(error);
                dispatch({
                    type: OPEN_FOLDER_ERROR,
                    payload: path
                })
            });
    }
}

export function closeFolder(path) {//закрыть папку
    return (dispatch)=>{
        dispatch({
            type: CLOSE_FOLDER,
            payload: path
        })
    }
}
