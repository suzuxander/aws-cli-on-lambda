import { Construct } from 'constructs';
import { CfnFunction, CfnLayerVersion } from 'aws-cdk-lib/aws-sam';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AwsCliLayer } from 'aws-cdk-lib/lambda-layer-awscli';

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
      timeout,
      memorySize,
    } = options;

    return new CfnFunction(this, id, {
      codeUri,
      handler,
      role,
      functionName,
      layers,
      runtime: lambda.Runtime.PYTHON_3_7.toString(),
      timeout,
      memorySize,
    })
  };

  public lambdaServiceRole = (id: string, options: {
    roleName: string,
    policy?: { name?: string, statement: { effect: 'Allow' | 'Deny', action: string[], resource: string[] }[] },
  }): iam.CfnRole => {
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

    return new iam.CfnRole(this, id, {
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

  public lambdaLayerV2 = (id: string, options?: {}): AwsCliLayer => {
    return new AwsCliLayer(this, id);
  }

  public lambdaFunctionV2 = (id: string, options: {
    codePath: string,
    handler: string,
    role: iam.IRole,
    functionName?: string,
    layers?: lambda.ILayerVersion[],
    timeout?: number,
    memorySize?: number,
  }): lambda.Function => {
    const {
      codePath,
      handler,
      role,
      functionName,
      layers,
      timeout,
      memorySize,
    } = options;

    return new lambda.Function(this, id, {
      code: lambda.Code.fromAsset(codePath),
      handler,
      role,
      functionName,
      layers,
      runtime: lambda.Runtime.PYTHON_3_7,
      timeout: timeout ? Duration.seconds(timeout) : undefined,
      memorySize,
    })
  };

  public lambdaServiceRoleV2 = (id: string, options: {
    roleName: string,
  }): iam.IRole => {
    const {
      roleName,
    } = options;

    return new iam.Role(this, id, {
      roleName,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com', ),
      inlinePolicies: {
        'policy': new iam.PolicyDocument({
          statements: [new iam.PolicyStatement({
            actions: [ 'logs:*' ],
            effect: iam.Effect.ALLOW,
            resources: [ '*' ]
          })]
        })
      }
    });
  };
}
