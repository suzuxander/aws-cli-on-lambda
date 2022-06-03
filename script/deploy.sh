# create template
cd cdk
npm i
npm run build
npm run synth

# aws-cli setup
rm -rf temp
rm -rf lambda-layer-module

mkdir temp
python3 -m venv temp
cd temp
source bin/activate
pip install awscli
sed -i.bak "1s/.*/\#\!\/var\/lang\/bin\/python/" bin/aws
deactivate
cd ../

mkdir lambda-layer-module
cp ./temp/bin/aws lambda-layer-module/
cp -r ./temp/lib/python3.7/site-packages/* lambda-layer-module/

rm -rf temp

# cloudformation deploy
aws cloudformation package \
  --template-file cdk/cdk.out/sample-aws-cli-on-lambda.template.json \
  --s3-bucket ${ARTIFACT_BUCKET} \
  --s3-prefix sample-aws-cli-on-lambda \
  --output-template-file template.yml

aws cloudformation deploy \
  --stack-name sample-aws-cli-on-lambda \
  --template-file template.yml \
  --capabilities CAPABILITY_NAMED_IAM