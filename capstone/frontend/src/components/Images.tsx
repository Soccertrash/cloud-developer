import * as React from 'react'
import {Grid, Header, Loader, Image as ImageUi} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {Image} from "../types/Image";
import {getImages} from "../api/image-api";

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
}

export class Images extends React.PureComponent<ImagesProps, ImagesState> {
    state: ImagesState = {
        images: [],
        loadingImages: true
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
        return (
            <Grid padded>
                {this.state.images.map((img, pos) => {
                    return (
                        <Grid.Row key={img.imageId}>
                            <Grid.Column verticalAlign="middle">
                                <ImageUi src={img.url} size="small" wrapped/>
                            </Grid.Column>

                        </Grid.Row>
                    )
                })}
            </Grid>
        )
    }

}
