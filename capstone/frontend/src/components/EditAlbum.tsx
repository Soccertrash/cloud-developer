import * as React from 'react'
import {Button, Form} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {getUploadUrl, uploadFile} from '../api/album-api'

enum UploadState {
    NoUpload,
    FetchingPresignedUrl,
    UploadingFile,
}

interface UploadImagesProps {
    match: {
        params: {
            albumId: string
        }
    }
    auth: Auth
}

interface EditTodoState {
    files: Array<File>
    uploadState: UploadState
}

export class EditAlbum extends React.PureComponent<UploadImagesProps,
    EditTodoState> {
    state: EditTodoState = {
        files: [],
        uploadState: UploadState.NoUpload
    }

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return


        this.setState({
            files: Array.from(files)
        })
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            if (!this.state.files) {
                alert('File should be selected')
                return
            }


            for (const f of this.state.files) {
                this.setUploadState(UploadState.FetchingPresignedUrl)

                // Create Image

                const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.albumId)

                this.setUploadState(UploadState.UploadingFile)
                await uploadFile(uploadUrl, f)

                alert('File was uploaded!' )
            }

        } catch (e) {
            alert('Could not upload a file: ' + e.message)
        } finally {
            this.setUploadState(UploadState.NoUpload)
        }
    }

    setUploadState(uploadState: UploadState) {
        this.setState({
            uploadState
        })
    }

    render() {
        return (
            <div>
                <h1>Upload new image</h1>

                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>File</label>
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Image to upload"
                            onChange={this.handleFileChange}
                            multiple={true}
                        />
                    </Form.Field>

                    {this.renderButton()}
                </Form>
            </div>
        )
    }

    renderButton() {

        return (
            <div>
                {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
                {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
                <Button
                    loading={this.state.uploadState !== UploadState.NoUpload}
                    type="submit"
                >
                    Upload
                </Button>
            </div>
        )
    }
}
