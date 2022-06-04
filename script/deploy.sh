## aws-cli setup
#rm -rf temp
#rm -rf lambda-layer-module
#
#mkdir temp
#python3 -m venv temp
#cd temp
#source bin/activate
#pip install awscli
#sed -i.bak "1s/.*/\#\!\/var\/lang\/bin\/python/" bin/aws
#deactivate
#cd ../
#
#mkdir lambda-layer-module
#cp ./temp/bin/aws lambda-layer-module/
#cp -r ./temp/lib/python3.7/site-packages/* lambda-layer-module/
#
#rm -rf temp
#
## create template
#cd cdk
#npm i
#npm run build
#npm run synth
#cd ..

# cloudformation deploy
STACK_NAME=aws-cli-on-lambda-sample

aws cloudformation package \
  --template-file cdk/cdk.out/${STACK_NAME}.template.json \
  --s3-bucket ${ARTIFACT_BUCKET} \
  --s3-prefix ${STACK_NAME} \
  --output-template-file template.yml

aws cloudformation deploy \
  --stack-name ${STACK_NAME} \
  --template-file template.yml \
  --capabilities CAPABILITY_NAMED_IAM