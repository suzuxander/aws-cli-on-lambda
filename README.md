# aws-cli-on-lambda-sample
## 概要
LambdaLayerを利用して、aws-cliをLambda関数から実行するプロジェクトのサンプル。  
aws-sdkでは実装されていない機能を実行するために用いる想定。  
[`aws-cdk-lib/lambda-layer-awscli`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.lambda_layer_awscli.AwsCliLayer.html)を用いてこれを実現する。
  
### 注意点
aws-cliを実行するためにPythonが必要になるため、Lambda関数のランタイムはPythonである必要がある。(はず)

## 前提
以下はインストール済みとする。
- ~Python 3.6くらい~
- NodeJS 16くらい

## 使用方法
### デプロイ
コマンドラインからデプロイを実行する。
```bash
# デプロイ実行
$ npm run deploy

...省略

aws-cli-on-lambda-sample: creating CloudFormation changeset...

 ✅  aws-cli-on-lambda-sample

✨  Deployment time: 58.93s
```
デプロイが正常終了したらLambda関数が生成されている。  
CloudFormationのマネジメントコンソールなどから確認する。

### Lambda関数の実行
マネジメントコンソールからLambda関数をテスト実行し、以下のように結果が表示されればOK。  
```
Test Event Name
test

Response
"aws-cli/1.25.1 Python/3.7.13 Linux/4.14.255-276-224.499.amzn2.x86_64 exec-env/AWS_Lambda_python3.7 botocore/1.27.1\n"

Function Logs
...

Request ID
...
```

### Lambda関数の実装
以下のようにしてaws-cliを実行する。実際のコードは[こちら](./lambda/src/index.py)。
```python
import subprocess

def handler(event, context):
    result = subprocess.run(['/opt/awscli/aws', '--version'], stdout=subprocess.PIPE)
    return result.stdout.decode()
```
