import dateFormat from 'dateformat'
import {History} from 'history'
import * as React from 'react'
import {Button, Divider, Form, Grid, Header, Icon, Loader} from 'semantic-ui-react'

import {createAlbum, deleteAlbum, getAlbums,} from '../api/album-api'
import Auth from '../auth/Auth'
import {Album} from '../types/Album'

interface AlbumsProps {
    auth: Auth
    history: History
}

interface AlbumsState {
    albums: Album[]
    newAlbumName: string
    newAlbumDesc: string
    loadingAlbums: boolean
}

export class Albums extends React.PureComponent<AlbumsProps, AlbumsState> {
    state: AlbumsState = {
        albums: [],
        newAlbumName: '',
        newAlbumDesc: '',
        loadingAlbums: true
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newAlbumName: event.target.value})
    }

    handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newAlbumDesc: event.target.value})
    }

    onEditButtonClick = (albumId: string) => {
        this.props.history.push(`/album/${albumId}/edit`)
    }

    onAlbumCreate = async () => {
        try {
            const newAlbum = await createAlbum(this.props.auth.getIdToken(), {
                name: this.state.newAlbumName,
                description: this.state.newAlbumDesc
            })
            this.setState({
                albums: [...this.state.albums, newAlbum],
                newAlbumName: '',
                newAlbumDesc: ''

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
                <Header as="h1">Albums</Header>

                {this.renderCreateAlbumInput()}

                {this.renderAlbums()}
            </div>
        )
    }

    renderCreateAlbumInput() {
        return (

            <Form onSubmit={this.onAlbumCreate}>

                    <Form.Field required>
                        <label>Album Name:</label>
                        <input placeholder="Album name" onChange={this.handleNameChange} value={this.state.newAlbumName}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Album Description:</label>
                        <input placeholder="Album description" onChange={this.handleDescriptionChange} value={this.state.newAlbumDesc}/>
                    </Form.Field>
                    <Button type='submit' color="teal">Create Album</Button>


                <Divider/>
            </Form>


        );
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
                    Loading albums
                </Loader>
            </Grid.Row>
        )
    }

    renderAlbumsList() {
        return (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={4} verticalAlign="middle">
                        <b>Album Name</b>
                    </Grid.Column>
                    <Grid.Column width={10} floated="left">
                        <b>Album Description</b>
                    </Grid.Column>
                </Grid.Row>
                {this.state.albums.map((album, pos) => {
                    return (
                        <Grid.Row key={album.albumId}>
                            <Grid.Column width={4} verticalAlign="middle">
                                {album.name}
                            </Grid.Column>
                            <Grid.Column width={10} floated="left">
                                {album.description}
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button
                                    icon
                                    color="blue"
                                    onClick={() => this.onEditButtonClick(album.albumId)}
                                >
                                    <Icon name="pencil"/>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={1} floated="right">
                                <Button
                                    icon
                                    color="red"
                                    onClick={() => this.onAlbumDelete(album.albumId)}
                                >
                                    <Icon name="delete"/>
                                </Button>
                            </Grid.Column>
                            {/*{album.attachmentUrl && (*/}
                            {/*  <Image src={album.attachmentUrl} size="small" wrapped />*/}
                            {/*)}*/}
                            <Grid.Column width={16}>
                                <Divider/>
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
