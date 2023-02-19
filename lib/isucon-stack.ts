import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Stage } from './stage';

interface IsuconStackProps extends cdk.StackProps {
  readonly stage: Stage;
  readonly publicKeyMaterial: string;
}

interface InstanceDetail {
  readonly name: string;
  readonly publicIp: string;
}

export class IsuconStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IsuconStackProps) {
    super(scope, id, props);

    const {
      stage,
      publicKeyMaterial,
    } = props;

    const {
      name,
      machineImage,
      instanceType,
      instancesAmount,
      internalIngressPorts,
      externalIngressPorts,
      ebsSize,
    } = stage;

    const vpc = new ec2.Vpc(this, 'vpc', {
      ipAddresses: ec2.IpAddresses.cidr('192.168.0.0/24'),
      maxAzs: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const keyPair = new ec2.CfnKeyPair(this, 'keypair', {
      keyName: `${name}-keypair`,
      publicKeyMaterial,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'security-group', { vpc });

    // internal
    internalIngressPorts.forEach(port => {
      securityGroup.addIngressRule(securityGroup, ec2.Port.tcp(port));
    });

    // external
    externalIngressPorts.forEach(port => {
      securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(port));
    });

    const instanceDetails: InstanceDetail[] = [];

    // ['1', '2', ..., 'bench']
    [
      ...(Array.from(Array(instancesAmount).keys()).map(i => (i + 1).toString())),
      'bench',
    ].forEach((value, index) => {
      const instanceName = `${name}-${value}`;

      const instance = new ec2.Instance(this, instanceName, {
        instanceType,
        machineImage,
        vpc,
        blockDevices: [
          {
            deviceName: '/dev/sda1',
            volume: ec2.BlockDeviceVolume.ebs(ebsSize),
          },
        ],
        instanceName,
        keyName: keyPair.keyName,
        // > https://aws.amazon.com/vpc/faqs/
        // > Amazon reserves the first four (4) IP addresses and the last one (1) IP address of every subnet for IP networking purposes. 
        privateIpAddress: `192.168.0.${index + 11}`,
        securityGroup,
      }); 

      const eip = new ec2.CfnEIP(this, `${instanceName}-eip`, {
        instanceId: instance.instanceId,
      });

      instanceDetails.push({
        name: instanceName,
        publicIp: eip.attrPublicIp,
      });
    }); 

    // show ssh config
    const sshConfig = instanceDetails.map(detail => {
      return `Host ${detail.name}
  User ubuntu
  HostName ${detail.publicIp}
`;
    }).join("\n");

    new cdk.CfnOutput(this, `${name}-sshconfig`, { value: sshConfig })
  }
}
