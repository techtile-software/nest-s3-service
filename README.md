## aws-s3-service

The aws-s3-service package is a NestJS module that simplifies interactions with Amazon Simple Storage Service (S3). This module encapsulates common S3 operations, such as uploading, downloading, and deleting files. It seamlessly integrates with the NestJS configuration module (@nestjs/config) to securely retrieve AWS credentials and region information.

Installation

```
npm install aws-s3-service
```

### Configuration

To use the AwsS3Service module, you need to import it into your NestJS module and configure it with your AWS credentials and region. This can be done in your main application module or any module where you intend to use the service.

Example:

```
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from 'aws-s3-service';

@Module({
imports: [
ConfigModule.forRoot(), // Ensure @nestjs/config is properly configured
AwsModule, // Import the AwsS3Service module
// ... other modules
],
controllers: [],
providers: [],
})
export class AppModule {}
```

Ensure that you have the necessary AWS environment variables set in your .env file or through other means that @nestjs/config supports:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
AWS_SIGNATURE_VERSION=your_signature_version
```

### Usage

Once the AwsS3Service module is imported, you can inject the AwsS3Service into your NestJS components (services, controllers, etc.) and use its methods for S3 operations.

Example:

```
import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'aws-s3-service';

@Injectable()
export class MyService {
constructor(private readonly awsS3Service: AwsS3Service) {}

async uploadFileToS3(file: Buffer, key: string): Promise<void> {
const params = {
Bucket: 'your_bucket_name',
Key: key,
Body: file,
};

    await this.awsS3Service.uploadToS3(params);

}

async downloadFileFromS3(key: string): Promise<Buffer> {
const params = {
Bucket: 'your_bucket_name',
Key: key,
};

    const s3Object = await this.awsS3Service.getObject(params);

    // Process the downloaded object as needed
    return s3Object.Body as Buffer;

}

async deleteFileFromS3(key: string): Promise<void> {
const params = {
Bucket: 'your_bucket_name',
Key: key,
};

    await this.awsS3Service.deleteFileFromS3(params);

}

async checkIfFileExistsInS3(key: string): Promise<boolean> {
const params = {
Bucket: 'your_bucket_name',
Key: key,
};

    return this.awsS3Service.checkIfFileExistsInS3(params);

}
}
```

Make sure to replace 'your_bucket_name' with the actual name of your S3 bucket.

License
This package is open-source and available under the MIT License. Feel free to contribute, report issues, or suggest improvements.

### VERSIONING

- 1.0.0 First release
- 1.0.1 Backward compatible bug fixes
- 1.0.2 Backward compatible bug fixes
  Version 1.0.2 introduces additional documentation for the AwsS3Service module. The documentation provides detailed information about the available methods, their parameters, and usage examples. You can find the documentation in the docs folder of the package.
- 1.0.3 Backward compatible bug fixes
  Added README.md file
