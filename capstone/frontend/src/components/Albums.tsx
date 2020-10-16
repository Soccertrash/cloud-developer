import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createAlbum, deleteAlbum, getAlbums, /*patchAlbum*/ } from '../api/album-api'
import Auth from '../auth/Auth'
import { Album } from '../types/Album'

interface AlbumsProps {
  auth: Auth
  history: History
}

interface AlbumsState {
  albums: Album[]
  newAlbumName: string
  loadingAlbums: boolean
}

export class Albums extends React.PureComponent<AlbumsProps, AlbumsState> {
  state: AlbumsState = {
    albums: [],
    newAlbumName: '',
    loadingAlbums: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAlbumName: event.target.value })
  }

  onEditButtonClick = (albumId: string) => {
    this.props.history.push(`/album/${albumId}/edit`)
  }

  onAlbumCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newAlbum = await createAlbum(this.props.auth.getIdToken(), {
        name: this.state.newAlbumName,
        description: "Desc"
      })
      this.setState({
        albums: [...this.state.albums, newAlbum],
        newAlbumName: ''
      })
    } catch {
      alert('Album creation failed')
    }
  }

  onAlbumDelete = async (albumId: string) => {
    try {
      await deleteAlbum(this.props.auth.getIdToken(), albumId)
      this.setState({
        albums: this.state.albums.filter(album => album.albumId != albumId)
      })
    } catch {
      alert('Album deletion failed')
    }
  }

  // onAlbumCheck = async (pos: number) => {
  //   try {
  //     const album = this.state.albums[pos]
  //     await patchAlbum(this.props.auth.getIdToken(), album.albumId, {
  //       name: album.name,
  //       dueDate: album.dueDate,
  //       done: !album.done
  //     })
  //     this.setState({
  //       albums: update(this.state.albums, {
  //         [pos]: { done: { $set: !album.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Album deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const albums = await getAlbums(this.props.auth.getIdToken())
      this.setState({
        albums,
        loadingAlbums: false
      })
    } catch (e) {
      alert(`Failed to fetch albums: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">ALBUMs</Header>

        {this.renderCreateAlbumInput()}

        {this.renderAlbums()}
      </div>
    )
  }

  renderCreateAlbumInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Album',
              onClick: this.onAlbumCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderAlbums() {
    if (this.state.loadingAlbums) {
      return this.renderLoading()
    }

    return this.renderAlbumsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading ALBUMs
        </Loader>
      </Grid.Row>
    )
  }

  renderAlbumsList() {
    return (
      <Grid padded>
        {this.state.albums.map((album, pos) => {
          return (
            <Grid.Row key={album.albumId}>
              <Grid.Column width={1} verticalAlign="middle">
                {/*<Checkbox*/}
                {/*  onChange={() => this.onAlbumCheck(pos)}*/}
                {/*  checked={album.done}*/}
                {/*/>*/}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {album.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {album.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(album.albumId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onAlbumDelete(album.albumId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {/*{album.attachmentUrl && (*/}
              {/*  <Image src={album.attachmentUrl} size="small" wrapped />*/}
              {/*)}*/}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
