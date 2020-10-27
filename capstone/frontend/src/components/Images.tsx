import * as React from 'react'
import {Button, Grid, Header, Icon, Image as ImageUi, Loader} from 'semantic-ui-react'
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
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        loadingImages: true,
        deletingImage: ""
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
        let columns: Array<JSX.Element> = []

        this.state.images.forEach((img, idx) => {

            columns.push(
                <Grid.Column verticalAlign="middle" key={img.imageId} width={4}>
                    <ImageUi src={img.url} size="small" wrapped/><br/>
                    <Button size='mini' onClick={() => this.onImageDelete(img.imageId)} icon>
                        <Icon name="trash alternate outline" loading={this.state.deletingImage == img.imageId}/>
                    </Button>
                </Grid.Column>
            )
            if ((idx + 1) % 5 == 0) {
                resultArray.push(
                    <Grid.Row>
                        {columns}
                    </Grid.Row>
                )
                columns = []
            }

        })
        if (columns.length > 0) {
            resultArray.push(
                <Grid.Row>
                    {columns}
                </Grid.Row>
            )
        }

        return (<Grid padded>{resultArray} </Grid>);
    }

}
