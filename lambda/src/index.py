import subprocess

def handler(event, context):
    result = subprocess.run(['/opt/aws', '--version'], stdout=subprocess.PIPE)
    return result.stdout.decode()
