import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface StageProps {
  readonly name: string;
  readonly ami: string;
  readonly instanceType: string;
  readonly instancesAmount: number;
  readonly internalIngressPorts?: number[];
  readonly externalIngressPorts?: number[];
  readonly ebsSize?: number;
}

const instanceClasses = {
  t2: ec2.InstanceClass.T2,
  t3: ec2.InstanceClass.T3,
  m4: ec2.InstanceClass.M4,
  m5: ec2.InstanceClass.M5,
};

const instanceSizes = {
  nano: ec2.InstanceSize.NANO,
  micro: ec2.InstanceSize.MICRO,
  small: ec2.InstanceSize.SMALL,
  medium: ec2.InstanceSize.MEDIUM,
  large: ec2.InstanceSize.LARGE,
};

export class Stage {
  public readonly name: string;
  public readonly instanceType: ec2.InstanceType;
  public readonly machineImage: ec2.IMachineImage;
  public readonly instancesAmount: number;
  public readonly internalIngressPorts: number[];
  public readonly externalIngressPorts: number[];
  public readonly ebsSize: number;

  constructor(props: StageProps) {
    this.name            = props.name;
    this.machineImage    = ec2.MachineImage.genericLinux({ 'ap-northeast-1': props.ami });
    this.instanceType    = this.instanceTypeFromString(props.instanceType);
    this.instancesAmount = props.instancesAmount;

    this.internalIngressPorts = props.internalIngressPorts ? props.internalIngressPorts : [80, 3306];
    this.externalIngressPorts = props.externalIngressPorts ? props.externalIngressPorts : [22, 80];

    this.ebsSize = props.ebsSize ? props.ebsSize : 20;
  }

  private instanceTypeFromString(instanceTypeStr: string): ec2.InstanceType {
    const [ instanceClassStr, instanceSizeStr ] = instanceTypeStr.split('.');

    const instanceClass = instanceClasses[instanceClassStr as keyof typeof instanceClasses];
    const instanceSize  = instanceSizes[instanceSizeStr as keyof typeof instanceSizes];

    return ec2.InstanceType.of(instanceClass, instanceSize);
  }
}
