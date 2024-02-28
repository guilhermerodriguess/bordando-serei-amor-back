import { S3 } from 'aws-sdk';
import path = require('path');
import mime = require('mime-types');
import fs = require('fs');

class S3Storage {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_REGION,
    });
  }

  async saveFile(filename: string): Promise<void> {
    const originalPath = path.resolve('.', 'upload', filename);

    const contentType = mime.lookup(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.client
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filename,
        })
        .promise();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default S3Storage;
