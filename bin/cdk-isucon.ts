#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IsuconStack } from '../lib/isucon-stack';
import { Stage, StageProps } from '../lib/stage';
import * as fs from 'fs';

const app = new cdk.App();

const stages = app.node.tryGetContext('stages') as StageProps[];
const publicKeyMaterial = fs.readFileSync('./id_ed25519.pub').toString();

stages.forEach(props => {
  const stage = new Stage(props);

  new IsuconStack(app, stage.name, {
    stage,
    publicKeyMaterial,
  });
});
