const express = require('express')
const app = express()
const BluebirdPromise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./aws-config.json')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const port = 4000
const BUCKET_NAME = "<TEST_BUCKET_NAME>"

const s3  = new AWS.S3();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res, next) => {
	res.send('Hello World!')
})

app.get('/start-upload', async (req, res, next) => {
	try {
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.query.fileName,
			ContentType: req.query.fileType
		}
		console.log("Bucket: ", BUCKET_NAME)
		console.log("Key: ", req.query.fileName)
		console.log("ContentType: ", req.query.fileType)
		let createUploadPromised = BluebirdPromise.promisify(s3.createMultipartUpload.bind(s3))
		let uploadData = await createUploadPromised(params)
		console.log("uploadData: ", uploadData)
		res.send({uploadId: uploadData.UploadId})
	} catch(err) {
		res.send({err})
		console.log("**** /start-upload err: ", err)
	}
})

app.get('/get-upload-url', async (req, res, next) => {
	try {
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.query.fileName,
			PartNumber: req.query.partNumber,
			UploadId: req.query.uploadId
		}
		console.log("**** /get-upload-url parameters: ", params)
		let uploadPartPromised = BluebirdPromise.promisify(s3.getSignedUrl.bind(s3))
		let presignedUrl = await uploadPartPromised('uploadPart', params)
		console.log("presignedUrl: ", presignedUrl)
		res.send({presignedUrl})
	} catch(err) {
		console.log("**** /get-upload-url err: ")
		console.log(err)
	}
})

app.post('/complete-upload', async (req, res, next) => {
	try {
		console.log("**** body: ", req.body, ': body')
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.body.params.fileName,
			MultipartUpload: {
				Parts: req.body.params.parts
			},
			UploadId: req.body.params.uploadId
		}
		console.log("Bucket: ", BUCKET_NAME)
		console.log("Key: ", req.body.params.fileName)
		console.log("MultipartUpload: ", params.MultipartUpload)
		console.log("UploadId: ", req.body.params.uploadId)

		console.log("**** /complete-upload parameters: ", params)
	    let completeUploadPromised = BluebirdPromise.promisify(s3.completeMultipartUpload.bind(s3))
		let data = await completeUploadPromised(params)
		console.log("data: ", data)
		res.send({data})
	} catch(err) {
		console.log("**** /complete-upload err: ", err)
	}
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))