# README
## 製品概要

### 背景(製品開発のきっかけ、課題等）
- 世の一人暮らしの民 コロナ禍で内食需要↑ 、健康志向も高まり、自炊するぞー になった話
- 限界男子大学生ワイ 自炊が続かない…
- 既存の料理本や料理レシピサイトはわかりにくい！

- 既存のレシピ投稿サイトや料理本では明確にされていなかった手続きをより明確にしたい
- 調理工程のどの時点で何の作業をすべきかを視覚的に分かりやすく表現したい

### 製品説明（具体的な製品の説明）
![](https://i.imgur.com/kiHNt21.png)
product: https://jphacks.github.io/A_2208/
movie:https://www.youtube.com/channel/UC4YRMsKsVNDv5QJ_bvQAf9g/featured
### 特長
#### 1. 特長1
調理工程をフローチャートとして表現することで"解釈のギャップを生まないレシピ"を作成できる
「材料A」「材料B」ではなく、矢印で作業の流れが一目瞭然です
#### 2. 特長2
WEBアプリ上のグラフィカルエディタで、直感的にフローチャート形式のレシピを編集できる
#### 3. 特長3
最近githubにも導入された、マークダウン形式で図を表現できる「mermaid」に準拠。
作成したレシピはシンプルなテキストファイルにエクスポート可能で、git管理できる
#### 4. 特長4
簡単な料理から手の込んだ料理まで、幅広い難易度に挑戦する手助けになる


### 解決出来ること

### 今後の展望
- レシピの一部の工程をコピーできるようにすることで、自分でレシピを投稿する・自己アレンジレシピを公開するハードルを下げる
- 分かりにくい調理工程をハイパーリンクしてさらに詳しいフローを確認できる
-  登録した工程を下処理・加熱など大まかにグルーピングすることで、コピーする手間を省ける
- 工程同士の繋ぎ方を、より直感的で簡単なものにする
- バックエンドとフロントエンドを接続する(時間切れ)
### 注力したこと（こだわり等）
* 設計段階で、mermaid記法のフローチャートを手入力してレシピを書いてみることで、大変書きにくいという知見を得た
* 上記を踏まえ、GUI上でフローチャートを編集できるグラフエディタの作成に注力することに決めた
* 現時点で600行のtypescriptからなる構文解析エンジンを実装し、GUI上でフローチャートを編集できる機能を追加した
* あくまで編集結果はmermaid記法準拠のplaintextなので、作成したレシピはgitで管理しgithubで公開できる。

## 開発技術
### 活用した技術
- Typescript
- HTML・CSS
- Firebase
- SQLite
#### フレームワーク・ライブラリ・モジュール
* Svelte
* Mermaid.js
* FastAPI


### 独自技術
#### ハッカソンで開発した独自機能・技術

独自のMermaid記法の構文解析エンジン
https://github.com/jphacks/A_2208/blob/master/src/frontend/src/GraphHandler.ts

Mermaid記法のフローチャート構文のある程度の解釈に対応しており、グラフ操作APIをUI側に提供している。
シンプルな記法ゆえ、構文定義としては甘く、構文解析ロジックの作成がかなり困難であった。

これをなんとか乗り越えたことで、独自記法ではなく、既存のエコシステムとの親和性が高い記法でグラフを扱うことと
GUI上での直感的なレシピ作成を可能にすることを両立した。


### レシピの保存とGithubへの公開手順
ここではカレーを作った後に福神漬けを添えてみます!

  1.【料理工程の追加】セクションのテキストボックスに「福神漬けを添える」を入力して**REGISTER**ボタンを押下します。
  ![image](https://user-images.githubusercontent.com/96977103/197335472-f23caf21-8108-4f67-8eef-22ddbbbace16.png)
  
  2. 画面上部の【フローチャートの作成】の部分に1で登録したノードが追加されているのを確認します。
  ![image](https://user-images.githubusercontent.com/96977103/197337177-b707d7da-ea63-45d0-b1b8-55872206a417.png)
  
  3. セクション下部の**ADD**ボタンを押下した後に「再度火をつけて5分煮込む」をクリック、続いて「福神漬けを添える」をクリックするとエッジが繋がります。
  ![image](https://user-images.githubusercontent.com/96977103/197337379-7c11d03a-5a70-472b-a4d0-20ea7f1f8f30.png)
  ![image](https://user-images.githubusercontent.com/96977103/197337528-da11a609-92d7-4286-ad4d-7b1cd13681f8.png)

  4. このレシピをmarkdownファイルとして出力するために、画面最下部の**レシピを保存する**ボタンを押下すると、markdownファイルがダウンロードできます。
  ![image](https://user-images.githubusercontent.com/96977103/197337462-dd22fca1-2373-4d8f-9d72-3176c71944ab.png)
  ![image](https://user-images.githubusercontent.com/96977103/197337471-e9e58ffb-f2db-4fee-894e-06ee560ec7f7.png)
  5. ダウンロードされたmarkdownファイルはただのテキストとして保存されるので、これをフローチャートとして保存するために、**flowchart TB**テキストの上部に「&#96;&#96;&#96;mermaid」を追加します。加えて、mermaid記法の終了を示すために末尾に「&#96;&#96;&#96;」を追加して、テキスト全体を囲んでください。
  ![image](https://user-images.githubusercontent.com/96977103/197336359-3abe2b37-8379-4141-80fc-dc0fc01c00f1.png)
  ![image](https://user-images.githubusercontent.com/96977103/197336364-d26edcca-d727-4b0c-92f7-3a60900ffe11.png)
  
  6. 自分のアレンジをアピールするために、適宜文章を書き加えて保存します。
  ![image](https://user-images.githubusercontent.com/96977103/197336573-9b4733c4-3a9a-46c2-ba03-a0546de5f2c1.png)
  
  7. Githubに公開するために「git add」、「git commit」、「git push」 を行います。
  ![image](https://user-images.githubusercontent.com/96977103/197336849-3ec0386c-630b-44b3-b889-5d3a3dcd0507.png)
  
　8. レシピが公開されたことを確認すれば完了です！
  ![image](https://user-images.githubusercontent.com/96977103/197336895-ff79e6fc-4e9c-4fae-831d-fb5e1ac1dd47.png)
  
- 実際に公開したレシピのリンク
  https://github.com/jphacks/A_2208/blob/master/my_curry.md
