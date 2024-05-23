import { PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

class S3Helper {
  private credentials = {
    accessKeyId: process.env.AWS_S3_ACCEESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  };

  private s3Client(): S3Client {
    const s3 = new S3Client({
      endpoint: process.env.AWS_S3_END_POINT,
      credentials: this.credentials,
      region: process.env.AWS_S3_REGION,
    });
    return s3;
  }

  public async uploadToS3(chunks: any, chunkName: string) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: chunkName,
      Body: chunks,
    };

    const s3 = this.s3Client();

    const upload: Upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    await upload.done();
    console.log("Uploading finished");
  }
}

export default new S3Helper();
