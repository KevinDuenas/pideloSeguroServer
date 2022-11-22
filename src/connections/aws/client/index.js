import AWS from 'aws-sdk';
import { AWSConfig } from '@config/environment';

AWS.config.update({
  ...AWSConfig,
});

export default AWS;
