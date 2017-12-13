import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as folderActions from '../actions/FolderActions';
import { Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

function getTree(tree, endpath){// функция возвращает узел дерева в стейте, который соответвует папке по пути path
    if (endpath.length>1) return getTree(tree.filter(node=>node.name===endpath[0])[0]['files'],endpath.slice(1));
    else if (endpath.length===1) return tree.filter(node=>node.name===endpath[0])[0];
}

class Folder extends Component {
    render() {
        const { name, path, folder } = this.props;
        let endpath = path.split('/');
        if (endpath[endpath.length-1]==='') endpath = endpath.slice(0,endpath.length-1);
        const {files, open} = getTree(folder, endpath);
        const {openFolder, closeFolder} = this.props.folderActions;
        return <div>
            <div onClick={open?closeFolder.bind(this, path):openFolder.bind(this, path)}>
                <span>{name}</span>
                <Glyphicon glyph={open?'folder-open':'folder-close'}/>
            </div>
            <div hidden={!open}>
                <ListGroup>
                {
                    open?files.map((file,i)=>{
                        return <ListGroupItem key={i}>
                                {file.type==='dir'?
                                    <ConnectedFolder name={file.name} path={file.path}/>:
                                    <span>{file.name+' '+file.size+' байт'}</span>}
                        </ListGroupItem>
                    }):[]
                }
                </ListGroup>
            </div>
        </div>
    }
}

Folder.propTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        folder: state.folder
    }
}

function mapDispatchToProps(dispatch) {
    return {
        folderActions: bindActionCreators(folderActions, dispatch)
    }
}

const ConnectedFolder = connect(mapStateToProps, mapDispatchToProps)(Folder)
export default ConnectedFolder
