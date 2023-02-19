# cdk-isucon

## 概要

AWS上にISUCONの練習環境を立ち上げるためのツールです。実行にはAWS CDKを利用しています。

## 事前準備

### 前提

このツールは以下が整っていることを前提に動作します。

- Node.jsがインストールされている
    - 少なくとも最新のCDKがサポートしている範囲のバージョンを利用してください
- AWSアカウントが存在しており、CLIから操作できる状態である
    - AWSアカウントは専用に払い出すことを強くお勧めします
    - cdk bootstrapおよびVPC, EC2関連の操作が可能な状態にしてください
        - あまりお勧めはできませんが、詳しくなければAdministratorAccess PolicyのついたIAM userを用意してください

### ツールの実行環境を整える

以下のコマンドを発行し、実行環境を整えてください。

```
$ git clone 
$ cd cdk-isucon
$ npm i
```

このツールはEC2のキーペアに公開鍵を登録し、対応する秘密鍵でEC2にSSHログインできるように環境を構築します。公開鍵をアップロードするため、このrepoの直下に公開鍵を `id_ed25519.pub` という名前で配置してください。もしEd25519鍵を持っていない場合は、以下のコマンドで生成してから配置してください。

```
$ ssh-keygen -t ed25519
```

もし利用するAWSアカウントで `cdk bootstrap` を実行したことがない場合は、 `cdk bootstrap` コマンドを実行してください。

```
$ npm run cdk bootstrap
```

## ISUCONの練習環境を立ち上げる

このツールは各環境をひとつのStackとして扱い、全ての環境分のStackを定義します。立ち上げたい環境に対応するStack名を指定して `cdk diff` や `cdk deploy` を実行する必要があります。もし何も指定せずに実行した場合、全ての環境が同時に立ち上がるので注意してください。

立ち上げられる環境は以下のコマンドで確認できます。

```
$ npm run cdk ls
```

例えば、ISUCON10予選の環境を立ち上げる際に作成されるリソースは以下のコマンドで確認できます。

```
$ npm run cdk diff isucon10q
```

ISUCON10予選の環境を立ち上げるには、以下のコマンドを実行します。

```
$ npm run cdk deploy isucon10q
```

ひととおりの練習が終了したら、以下のコマンドで環境を破棄してください。

```
$ npm run cdk destroy
```

## ISUCONについて

「ISUCON」は、LINE株式会社の商標または登録商標です。本ツールは「ISUCON」を運営するLINE株式会社とは一切関係ありません。本ツールについての問い合わせは本リポジトリのIssueに起票してください。

ISUCON is a trademark or registered trademark of LINE Corporation. This tool is not related with LINE Corporation. If you need some support, please create an issue in this repository.

https://isucon.net
