import { OPEN_FOLDER_SUCCESS, OPEN_FOLDER_ERROR, CLOSE_FOLDER } from '../constants/Folder';

const initialState = [{
    name: 'disk:',
    files: [],
    open: 0,
    type: '',
    size: 0,
    path: ''
}];

function replaceInArr(arr, key, val, newNode){//функция возвращает массив, как результат замены некоторого элемента массива на newNode
    return arr.map(el=>{
        if (el[key]===val) return Object.assign(el, newNode);
        else return el;
    });
}
function replaceInTree(tree, endpath, path, files, open){//фуекция заменяет нужный узел в дереве стейта и возвращает измененное дерево
    if (endpath.length>1) {//внутри этой функции создаются копии дерева, из-за чего не нарушается требование иммутабельности стейта
        return replaceInArr(tree, 'name', endpath[0],{
            files: replaceInTree(tree.filter(node=>node.name===endpath[0])[0]['files'],endpath.slice(1), path, files, open)
        });
    } else if (endpath.length==1) {
        let newNode = {
            files: open?files.map(file=>{
                return {
                    name: file.name,
                    files:[],
                    open: 0,
                    type: file.type,
                    size: file.type==='dir'?0:file.size,
                    path: file.path
                }
            }):[],
            open: open,
            name: endpath[0],
            type: 'dir',
            size: 0,
            path: path
        };
        return replaceInArr(tree, 'name', endpath[0], newNode);
    }

}

export default function folder(state = initialState, action) {
    switch (action.type) {
        case OPEN_FOLDER_SUCCESS:
            let {path} = action.payload;
            if (path[path.length-1]==='/') path = path.substr(0,path.length-1);
            return replaceInTree(state, path.split('/'), action.payload.path, action.payload.files, 1);
        case CLOSE_FOLDER:
            path = action.payload;
            if (path[path.length-1]==='/') path = path.substr(0,path.length-1);
            return replaceInTree(state, path.split('/'), action.payload, [], 0);
        case OPEN_FOLDER_ERROR:
        default:
            return state;
    }
}
