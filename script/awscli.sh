rm -rf temp
rm -rf lambda-layer-module

mkdir temp
python3 -m venv temp
cd temp
source bin/activate
pip install awscli
sed -i.bak "1s/.*/\#\!\/var\/lang\/bin\/python/" bin/aws
deactivate
cd ../

mkdir lambda-layer-module
cp ./temp/bin/aws lambda-layer-module/
cp -r ./temp/lib/python3.7/site-packages/* lambda-layer-module/

rm -rf temp
