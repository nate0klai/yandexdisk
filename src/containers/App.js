import React, { Component } from 'react'
import ConnectedFolder from '../components/Folder'
import { ListGroupItem } from 'react-bootstrap';

class App extends Component {
    render() {
        return <ListGroupItem>
          <ConnectedFolder name='My yandex disk' path='disk:/'/>
        </ListGroupItem>
    }
}

export default App
