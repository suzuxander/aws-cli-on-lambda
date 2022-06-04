# aws-cli-on-lambda-sample
## 概要
LambdaLayerを利用して、aws-cliをLambda関数から実行するプロジェクトのサンプル。  
aws-sdkでは実装されていない機能を実行するために用いる想定。  
  
### 注意点
aws-cliを実行するためにPythonが必要になるため、Lambda関数のランタイムはPythonである必要がある。(はず)

## 前提
以下はインストール済みとする。
- Python 3.6くらい
- NodeJS 16くらい

## 使用方法
### デプロイ
コマンドラインからデプロイを実行する。
```bash
# アーティファクトを配置するS3バケットを環境変数に設定する
$ export ARTIFACT_BUCKET={ARTIFACT_BUCKET}

# デプロイ実行
$ npm run deploy

...省略

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - aws-cli-on-lambda-sample
```
デプロイが正常終了したらLambda関数が生成されている。  
CloudFormationのマネジメントコンソールなどから確認する。

### Lambda関数実行
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

## Lambda Layer
### モジュールのパッケージング
必要なことは[ここ](./script/awscli.sh)でやっている。  
awscliをインストールして、実行に必要なモジュールと一緒にパッケージングする。
```bash
$ mkdir temp
$ python3 -m venv temp
$ cd temp
$ source bin/activate
$ pip install awscli
$ sed -i.bak "1s/.*/\#\!\/var\/lang\/bin\/python/" bin/aws
$ deactivate
$ cd ../

$ mkdir lambda-layer-module
$ cp ./temp/bin/aws lambda-layer-module/
$ cp -r ./temp/lib/python3.7/site-packages/* lambda-layer-module/
```
### aws-cliの実行方法
以下のようにしてaws-cliを実行する。実際のコードは[こちら](./lambda/src/index.py)。
```python
import subprocess

def handler(event, context):
    result = subprocess.run(['/opt/aws', '--version'], stdout=subprocess.PIPE)
    return result.stdout.decode()

```
