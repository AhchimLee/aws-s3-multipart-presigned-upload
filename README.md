## Multipart + Presigned URL upload to AWS S3 via the browser

### Motivation

I created this demo repo because documentation for multipart uploading of large files using presigned URLs was very scant.

I wanted to create a solution to allow users to upload files directly from the browser to AWS S3 (or any S3-compliant storage server). This worked great when I used AWS SDK's getSignedUrl API to generate a temporary URL that the browser could upload the file to. 

However, I hit a snag when dealing with files > 5GB because the pre-signed URL only allows for a maximum file size of 5GB to be uploaded at one go. As such, this repo demonstrates the use of multipart + presigned URLs to upload large files to an AWS S3-compliant storage service.

### Components used in this demo

* Frontend Server: React (Next.js)
* Backend Server: Node.js (Express), using the AWS JS SDK

### How to run

* Clone the repo and change directory into the repo
* Open two different terminal windows.

**Backend Server**

Replace the following code in `backend/aws-config.json` with your AWS S3.

```json
{ 
    "accessKeyId": "<ACCESS_KEY_ID>" ,
    "secretAccessKey": "<SECRET_ACCESS_KEY>" ,
    "region": "ap-northeast-2", 
    "signatureVersion": "v4" 
}
```

Replace the following code in `backend/server.js` with your AWS S3.
```js
const BUCKET_NAME = "<TEST_BUCKET_NAME>"
```

In window 1, run:
```sh
cd backend
npm install
node server.js
```

**Frontend Server**

In window 2, run:
```sh
cd frontend
npm install
npm run dev
```
If it error ocurred,   
also run this code:  
`npm install axios --save`

**Upload File**

Go to `http://localhost:3000` in your browser window and upload a file.
