import { join } from "path";
import s3 from "@connections/aws/s3";
import { AWSConfig } from "@config/environment";
const { s3Bucket } = AWSConfig;

const AWSQueries = {
  signFileUrl: async (_, { filePath, fileType }, { user: { id } }) => {
    const filePathWithoutStrangeCharacters = filePath.replace(/\)|\(/g, "");
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: s3Bucket,
      Key: filePathWithoutStrangeCharacters,
      Expires: 500, // To prevent future unauthorized uses of URL
      ContentType: fileType,
      //ACL: "public-read",
    });
    return {
      signedUrl,
      fileUrl: `https://${s3Bucket}.s3.amazonaws.com/${encodeURI(
        filePathWithoutStrangeCharacters
      )}`,
    };
  },
};

export default AWSQueries;
