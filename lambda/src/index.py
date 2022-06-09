import subprocess

def handler(event, context):
    result = subprocess.run(['/opt/awscli/aws', '--version'], stdout=subprocess.PIPE)
    return result.stdout.decode()
