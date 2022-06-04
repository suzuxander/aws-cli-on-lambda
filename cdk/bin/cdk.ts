#!/usr/bin/env node
import 'source-map-support/register';
import { CdkStack } from '../lib/cdk-stack';
import { App } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

const app = new App();
const stack = new CdkStack(app, 'aws-cli-on-lambda-sample', {
  env: { region: 'ap-northeast-1' }
});

const layer = stack.lambdaLayer('LambdaLayer', {
  layerName: 'aws-cli-on-lambda-sample-layer',
  contentUri: '../../lambda-layer-module'
});

const role = stack.lambdaServiceRole('LambdaFunctionServiceRole', {
  roleName: 'aws-cli-on-lambda-sample-layer-role'
});

stack.lambdaFunction('LambdaFunction', {
  functionName: 'aws-cli-on-lambda-sample-function',
  role: role.attrArn,
  codeUri: '../../lambda/src',
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_7,
  layers: [ layer.ref ],
  timeout: 30
});
