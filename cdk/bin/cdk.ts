#!/usr/bin/env node
import 'source-map-support/register';
import { CdkStack } from '../lib/cdk-stack';
import { App } from '@aws-cdk/core';
import { Runtime } from '@aws-cdk/aws-lambda';

const app = new App();
const stack = new CdkStack(app, 'sample-aws-cli-on-lambda', {
  env: { region: 'ap-northeast-1' }
});

const layer = stack.lambdaLayer('LambdaLayer', {
  layerName: 'sample-aws-cli-on-lambda-layer',
  contentUri: '../../module'
});

const role = stack.lambdaServiceRole('LambdaFunctionServiceRole', {
  roleName: 'sample-aws-cli-on-lambda-layer-role'
});

stack.lambdaFunction('LambdaFunction', {
  functionName: 'sample-aws-cli-on-lambda-function',
  role: role.attrArn,
  codeUri: '../../lambda/src',
  handler: 'index.handler',
  runtime: Runtime.PYTHON_3_7,
  layers: [ layer.ref ],
  timeout: 30
});
