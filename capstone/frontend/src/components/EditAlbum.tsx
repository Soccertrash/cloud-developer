import * as React from 'react'
import {Button, Form, Label} from 'semantic-ui-react'
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
    error: string
    uploadedFiles: number
    done: boolean
}

export class EditAlbum extends React.PureComponent<UploadImagesProps,
    EditTodoState> {
    state: EditTodoState = {
        files: [],
        uploadState: UploadState.NoUpload,
        error: "",
        uploadedFiles: 0,
        done: false
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
        this.state.error = ""
        this.state.done = false

        try {
            if (!this.state.files) {
                this.state.error = "No file was selected"
                return
            }

            this.state.uploadedFiles = 0

            for (const f of this.state.files) {
                this.setUploadState(UploadState.FetchingPresignedUrl)

                // Create Image
                const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.albumId)

                this.setUploadState(UploadState.UploadingFile)
                await uploadFile(uploadUrl, f)
                this.state.uploadedFiles++
            }
            this.state.done = true

        } catch (e) {
            this.state.error = 'Could not upload a file: ' + e.message
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
                {this.state.uploadState === UploadState.UploadingFile &&
                <p>Uploading file {this.state.uploadedFiles}/{this.state.files.length}</p>}
                <Button
                    loading={this.state.uploadState !== UploadState.NoUpload}
                    type="submit"
                >
                    Upload
                </Button>
                {this.state.done && <p><Label color='teal'>Upload was successful</Label></p>}
                {this.state.error !== "" && <p><Label color='red'>this.state.error</Label></p>}

            </div>
        )
    }
}
