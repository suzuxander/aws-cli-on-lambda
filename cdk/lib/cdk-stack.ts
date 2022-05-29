import { CfnFunction, CfnLayerVersion } from '@aws-cdk/aws-sam';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Runtime } from '@aws-cdk/aws-lambda';
import { CfnRole } from '@aws-cdk/aws-iam';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }

  public lambdaLayer = (id: string, options: { layerName?: string, contentUri: string }): CfnLayerVersion => {
    const { layerName, contentUri } = options;
    return new CfnLayerVersion(this, id, {
      layerName,
      contentUri
    })
  }

  public lambdaFunction = (id: string, options: {
    codeUri: string,
    handler: string,
    role: string,
    runtime: Runtime,
    functionName?: string,
    layers?: string[],
    timeout?: number,
    memorySize?: number,
  }) => {
    const {
      codeUri,
      handler,
      role,
      functionName,
      layers,
      runtime,
      timeout,
      memorySize,
    } = options;

    return new CfnFunction(this, id, {
      codeUri,
      handler,
      role,
      functionName,
      layers,
      runtime: runtime.toString(),
      timeout,
      memorySize,
    })
  };

  public lambdaServiceRole = (id: string, options: {
    roleName: string,
    policyName?: string,
    functionName: string
  }): CfnRole => {
    const {
      roleName,
      policyName,
      functionName
    } = options;

    return new CfnRole(this, id, {
      roleName,
      assumeRolePolicyDocument: {
        Statement: [{
          Action: [ 'sts:AssumeRole' ],
          Effect: 'Allow',
          Principal: {
            Service: [ 'lambda.amazonaws.com' ]
          }
        }],
        Version: '2012-10-17'
      },
      policies: [{
        policyName: policyName ?? 'policy',
        policyDocument: {
          Statement: [
            {
              Action: [
                'lambda:*'
              ],
              Effect: 'Allow',
              Resource: [
                'arn:aws:lambda:ap-northeast-1:*:function:' + functionName
              ]
            },
          ],
          Version: '2012-10-17'
        }
      }]
    });
  };
}
