#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IsuconStack } from '../lib/isucon-stack';
import * as fs from 'fs';

const app = new cdk.App();

const name = 'isucon9q';
const publicKeyMaterial = fs.readFileSync('./id_ed25519.pub').toString();

new IsuconStack(app, name, {
  name,
  publicKeyMaterial,
});
