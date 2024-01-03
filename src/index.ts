/* THIRD PARTY IMPORTS */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { Module } from "@nestjs/common";

/* GLOBAL IMPORTS */

/* LOCAL IMPORTS */

/* ===================================================== */

@Injectable()
export class AwsS3Service {
  private readonly accessKeyId: string;
  private readonly secretKeyId: string;
  private readonly region: string;
  private readonly signatureVersion: string;
  private readonly s3Instance: AWS.S3;

  constructor(private configService: ConfigService) {
    this.accessKeyId = this.configService.get("AWS_ACCESS_KEY_ID");
    this.secretKeyId = this.configService.get("AWS_SECRET_ACCESS_KEY");
    this.region = this.configService.get("AWS_REGION");
    this.signatureVersion = this.configService.get("AWS_SIGNATURE_VERSION");
    this.s3Instance = new AWS.S3();
    this.s3Instance.config.update({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretKeyId,
      region: this.region,
      signatureVersion: this.signatureVersion,
    });
  }

  /**
   * @description Uploads a file to the specified bucket in aws s3 bucket
   * @param {AWS.S3.PutObjectRequest} params
   * @returns {void}
   */
  async uploadToS3(
    params: AWS.S3.PutObjectRequest
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      return await this.s3Instance.upload(params).promise();
    } catch (error) {
      throw new HttpException((error as any).message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description Downloads a file from the specified bucket in aws s3 bucket
   * @param {AWS.S3.PutObjectRequest} params
   * @returns {void}
   */
  async getObject(
    params: AWS.S3.GetObjectRequest
  ): Promise<AWS.S3.GetObjectAclOutput> {
    try {
      const objectExists = await this.checkIfFileExistsInS3({
        Bucket: params.Bucket,
        Key: params.Key,
      });

      if (objectExists) {
        return await this.s3Instance.getObject(params).promise();
      }
    } catch (error) {
      throw new HttpException((error as any).message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description Deletes an image from a Bucket in AWS S3
   * @param {AWS.S3.DeleteObjectRequest} params Bucket name and key (name of the file)
   * @returns {void}
   */
  async deleteFileFromS3(params: AWS.S3.DeleteObjectRequest): Promise<void> {
    try {
      await this.s3Instance.deleteObject(params).promise();
    } catch (error) {
      throw new HttpException((error as any).message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description Checks if an object exists in Bucket S3
   * @param {AWS.S3.HeadObjectRequest} params
   * @returns {}
   */
  async checkIfFileExistsInS3(params: AWS.S3.HeadObjectRequest): Promise<any> {
    try {
      const result = await this.s3Instance
        .headObject({
          Bucket: params.Bucket,
          Key: params.Key,
        })
        .promise();
      if (result) return true;
    } catch (error) {
      if ((error as any).code === "NotFound") {
        return false;
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}

// aws.module.ts
@Module({
  imports: [],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
