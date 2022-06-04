import { Construct } from 'constructs';
import { CfnFunction, CfnLayerVersion } from 'aws-cdk-lib/aws-sam';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { CfnRole } from 'aws-cdk-lib/aws-iam';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
  }): CfnFunction => {
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
    policy?: { name?: string, statement: { effect: 'Allow' | 'Deny', action: string[], resource: string[] }[] },
  }): CfnRole => {
    const {
      roleName,
      policy
    } = options;

    let policies: any[] = [];
    if (policy) {
      policies = [{
        policyName: policy.name ?? 'policy',
        policyDocument: {
          Statement: policy.statement.map(st => (
            {
              Action: st.action,
              Effect: st.effect,
              Resource: st.resource
            }
          )),
          Version: '2012-10-17'
        }
      }];
    }

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
      policies
    });
  };
}
