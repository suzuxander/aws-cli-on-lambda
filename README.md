# aws-cli-on-lambda
## 概要
LambdaLayerを利用して、aws-cliをLambda関数から実行するプロジェクトのサンプル。  
aws-sdkでは実装されていない機能を実行するために用いる想定。  
  
### 注意点
aws-cliを実行するためにPythonが必要になるため、Lambda関数のランタイムはPythonである必要がある。(はず)

## 前提
以下はインストール済みとする。
- Python3
- NodeJS

## 使用方法
コマンドラインからデプロイを実行する。
```bash
# アーティファクトを配置するS3バケットを環境変数に設定する
$ ARTIFACT_BUCKET={ARTIFACT_BUCKET}
$ export ARTIFACT_BUCKET

# デプロイ実行
$ npm run deploy
```
デプロイが正常終了したらLambda関数が生成されている。  
マネジメントコンソールからLambda関数をテスト実行し、以下のように結果が表示されればOK。  
```
Test Event Name
test

Response
"aws-cli/1.24.10 Python/3.7.12 Linux/4.14.255-276-224.499.amzn2.x86_64 exec-env/AWS_Lambda_python3.7 botocore/1.26.10\n"

Function Logs
...

Request ID
...
```
適宜Lambda関数のロジックを修正してLambda関数からaws-cliを実行する。

## Lambda Layerの設定
必要なことは[ここ](./script/awscli.sh)でやっている。