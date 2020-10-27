# Use case description
Image Gallery
- Create and delete albums
- Add photos to an album
- Remove photos from an album

# Future work
- Generate map from GeoPositions of photos
- Generate thumbnails

# Usage
- Start frontend by going to "frontend" folder and run `npm start`. The page is available under http://localhost:3000

# Requirements checklist
- Project is in Github
- Project is documented (see this file and code comments)
- Project does not use CI because it is serverless and it is easier to deploy it to AWS cloud manually. Moreover we have not been taught to run serverless with CI
- Application allows deleting, creating and updating albums/images
- Application allows user to upload files
- Application uses login information
- Authentication is implemented via Auth0
- Codebase is splitted in multiple layers
- No callbacks are used
- Resources have been implementet in serverless.yml
- Each function has its own set of permission
- Application has logging and tracing enabled
- HTTP requests are validated
- Data is stored in multiple dynamodb tables
- Scan operation is not used
