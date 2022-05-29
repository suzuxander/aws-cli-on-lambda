aws cloudformation package \
  --template-file cdk/cdk.out/sample-aws-cli-on-lambda.template.json \
  --s3-bucket ${ARTIFACT_BUCKET} \
  --s3-prefix sample-aws-cli-on-lambda \
  --output-template-file template.yml