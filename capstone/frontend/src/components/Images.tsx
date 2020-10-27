import * as React from 'react'
import {Button, Card, Grid, Header, Icon, Image as UiImage, Loader, Modal} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {Image} from "../types/Image";
import {deleteImage, getImages} from "../api/image-api";

interface ImagesProps {
    auth: Auth
    match: {
        params: {
            albumId: string
        }
    }
}

interface ImagesState {
    images: Image[]
    loadingImages: boolean
    deletingImage: string
    modalOpen: number
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        loadingImages: true,
        deletingImage: "",
        modalOpen: -1
    }


    onImageDelete = async (imageId: string) => {
        this.setState({
            deletingImage: imageId
        })
        try {
            await deleteImage(this.props.auth.getIdToken(), this.props.match.params.albumId, imageId)
            this.setState({
                images: this.state.images.filter(image => image.imageId != imageId)
            })
        } catch {
            alert('Image deletion failed')
        }
        this.setState({
            deletingImage: ""
        })
    }

    async componentDidMount() {
        try {
            const images = await getImages(this.props.auth.getIdToken(), this.props.match.params.albumId)
            this.setState({
                images,
                loadingImages: false
            })
        } catch (e) {
            alert(`Failed to fetch albums: ${e.message}`)
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">Images</Header>


                {this.renderImages()}
            </div>
        )
    }

    renderImages() {
        if (this.state.loadingImages) {
            return this.renderLoading()
        }

        return this.renderImageTable()
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline="centered">
                    Loading images
                </Loader>
            </Grid.Row>
        )
    }


    renderImageTable() {

        let resultArray: Array<JSX.Element> = []
        this.state.images.forEach((img, idx) => {

            resultArray.push(
                <Card key={img.imageId}>
                    <Card.Content>
                        <Modal
                            key={idx}
                            size='large'
                            closeIcon
                            trigger={<UiImage src={img.url} fluid rounded/>}
                            onClose={() => this.setState({
                                modalOpen: -1
                            })}
                            onOpen={() => this.setState({
                                modalOpen: idx
                            })}
                            open={this.state.modalOpen == idx}
                        >
                            <Modal.Content image>
                                <UiImage src={img.url} wrapped/>
                            </Modal.Content>

                        </Modal>
                    </Card.Content>
                    <Card.Content extra>
                        <Button size='mini' onClick={() => this.onImageDelete(img.imageId)} icon>
                            <Icon name="trash alternate outline" loading={this.state.deletingImage == img.imageId}/>
                        </Button>
                    </Card.Content>
                </Card>
            )

        })


        return (<Card.Group itemsPerRow={5}>{resultArray} </Card.Group>);
    }

}
