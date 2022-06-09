#!/usr/bin/env node
import 'source-map-support/register';
import { CdkStack } from '../lib/cdk-stack';
import { App } from 'aws-cdk-lib';

const VERSION = process.env.VERSION === 'VERSION_1' ? 'VERSION_1' : 'VERSION_2';

const app = new App();
const stack = new CdkStack(app, 'aws-cli-on-lambda-sample', {
  env: { region: 'ap-northeast-1' }
});

const createVersion1 = (): void => {
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
    layers: [ layer.ref ],
    timeout: 30
  });
};

const createVersion2 = (): void => {
  const role = stack.lambdaServiceRoleV2('LambdaFunctionServiceRole', {
    roleName: 'aws-cli-on-lambda-sample-layer-role'
  });

  const layer = stack.lambdaLayerV2('LambdaLayer');

  stack.lambdaFunctionV2('LambdaFunction', {
    functionName: 'aws-cli-on-lambda-sample-function',
    codePath: '../lambda/src',
    handler: 'index.handler',
    layers: [layer],
    timeout: 30,
    role
  })
};

if (VERSION === 'VERSION_1') {
  createVersion1();
} else {
  createVersion2();
}