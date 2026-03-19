import { ReactElement } from "react";

export type Article = {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  publishedAt: string;
  tags: string[];
  content: string; // HTML content or TSX
};

export const articles: Article[] = [
  {
    slug: "beginner-portrait-tips",
    title: "被写体初心者必見！初めてのポートレート撮影で気をつけるべき5つのこと",
    description: "「初めて被写体をやるけれど、何を準備すればいいの？」そんな初心者の方向けに、ポートレート撮影を安全に、そして楽しく成功させるための5つの超重要ポイントを解説します。",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80",
    publishedAt: "2025-12-05T00:00:00Z",
    tags: ["被写体初心者", "ポートレート", "撮影マナー", "準備"],
    content: `
      <h2>はじめに</h2>
      <p>「カメラマンさんに撮影してもらうのは初めてで緊張する…」「どんな準備をして行けばいいの？」</p>
      <p>初めてポートレート（人物写真）の被写体になる時、不安はつきものですよね。<br />今回は、撮影をスムーズで楽しいものにするために、<strong>初心者が絶対に押さえておくべき5つのポイント</strong>をご紹介します！</p>

      <h2>1. 撮影のイメージ（テーマ）を事前にすり合わせる</h2>
      <p>「どんな服を着ればいいですか？」と当日に聞くのはNGです。<br />事前にカメラマンと<strong>「どんな雰囲気の写真を撮りたいか」</strong>をメッセージでしっかり相談しましょう。</p>
      <ul>
        <li><strong>服装のテイスト：</strong> カジュアル、清楚系、ストリート、コスプレなど</li>
        <li><strong>ロケーション：</strong> 公園、海、廃墟、スタジオ、カフェなど</li>
      </ul>
      
      <h2>2. 遅刻は厳禁！時間は余裕を持って</h2>
      <p>撮影には<strong>「光（太陽の角度）」</strong>が非常に重要です。特に夕暮れ時（マジックアワー）を狙った撮影などでは、15分の遅刻が致命傷になることもあります。</p>

      <h2>3. 自分の「NG事項」をはっきり伝える</h2>
      <p>撮影中、気分が乗らないことや嫌なポーズを要求されたら、我慢せずに<strong>「NGです」と伝える勇気</strong>が大切です。</p>

      <h2>4. コンディション（体調・肌・髪）を整える</h2>
      <p>どんなにカメラマンの腕が良くても、被写体のコンディションが悪いと良い作品は生まれません。前日はしっかり睡眠をとりましょう。</p>

      <h2>5. 安全第一！できれば最初は「昼間の人が多い場所」で</h2>
      <p>特にSNSやマッチング掲示板で出会った場合、密室や夜間の人気が少ない場所での撮影は信頼関係ができるまで避けるのが無難です。</p>

      <div style="margin-top: 40px; text-align: center;">
        <a href="/posts/new" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">さっそく募集を投稿する（無料）</a>
      </div>
    `
  },
  {
    slug: "how-to-pose-natural",
    title: "ガチガチにならない！カメラの前で自然なポーズをとる3つの秘訣",
    description: "カメラを向けられるとどうしても顔が強張ってしまう…そんな悩みを解消する、プロが教える「自然なポージング」の基礎。",
    coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80",
    publishedAt: "2025-12-12T00:00:00Z",
    tags: ["ポージング", "被写体向け", "初心者ガイド"],
    content: `
      <h2>自然な表情は「動く」ことから</h2>
      <p>じっと静止してカメラを見つめると、どうしても緊張してしまいます。「歩く」「振り返る」「髪を触る」といった一連の動作をしながら撮影してもらうことで、自然な表情が生まれやすくなります。</p>
      <h2>目線を外すテクニック</h2>
      <p>常にレンズを見つめる必要はありません。カメラマンの肩越しを見たり、足元を見つめたり、目線を外すだけでこなれた雰囲気になります。</p>
      <h2>手持ち無沙汰を解消する</h2>
      <p>手が余ってしまうと不自然になりがちです。バッグの紐を持つ、落ち葉を拾う、飲み物を持つなどの「小道具」を活用しましょう！</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/posts/new" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">被写体募集を探してみる</a>
      </div>
    `
  },
  {
    slug: "winter-illumination-portraits",
    title: "冬限定！イルミネーションポートレートを美しく撮る設定とコツ",
    description: "冬の醍醐味であるイルミネーション。背景の玉ボケを綺麗に作り、モデルの顔も明るく写すためのカメラ設定とストロボの基本。",
    coverImage: "https://images.unsplash.com/photo-1512359487770-38afb55d7b5b?auto=format&fit=crop&q=80",
    publishedAt: "2025-12-18T00:00:00Z",
    tags: ["カメラマン向け", "冬の撮影", "イルミネーション", "夜景"],
    content: `
      <h2>玉ボケを作るには？</h2>
      <p>イルミネーションを美しい玉ボケにするには、できるだけF値の小さい（F1.4〜F2.8など）単焦点レンズを使用し、モデルと背景のイルミネーションを離すことがポイントです。</p>
      <h2>モデルの顔が暗くなる問題</h2>
      <p>背景が明るいため、そのまま撮ると被写体がシルエットになってしまいます。街灯の光を利用するか、ごく弱い出力のストロボやLEDライトを顔に当ててバランスを取りましょう。</p>
      <h2>寒さ対策も忘れずに</h2>
      <p>冬の夜の撮影は非常に冷え込みます。モデル用のホッカイロや温かい飲み物を用意するなど、カメラマンの気遣いも重要です。</p>
    `
  },
  {
    slug: "portrait-location-tips",
    title: "【保存版】ポートレート撮影のロケーション選びのコツと、許可申請の基本",
    description: "素敵なポートレートを撮るために欠かせない「ロケーション（場所）選び」。光の読み方から撮影許可の基礎知識まで解説します。",
    coverImage: "https://images.unsplash.com/photo-1518331189912-8ecf6a15ba13?auto=format&fit=crop&q=80",
    publishedAt: "2025-12-25T00:00:00Z",
    tags: ["ロケーション", "撮影許可", "カメラマン向け", "野外撮影"],
    content: `
      <h2>写真の良し悪しの7割は「場所と光」で決まる</h2>
      <p>どんなに良い機材を使っても、光が汚い場所では良い写真は撮れません。日陰の境界線など、柔らかなディフューズ光が入る場所を探しましょう。</p>
      <h2>トイレや休憩場所の有無</h2>
      <p>モデルさんを連れての野外撮影では、着替えやメイク直しができる場所が近くにあるかどうかが非常に重要です。</p>
      <h2>「撮影許可」の基礎知識</h2>
      <p>日本の多くの公園では、レフ板や三脚を用いる撮影には公園緑地事務所等の「撮影許可」が必要です。事前に公式WEBサイトを確認しましょう。</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/t/tokyo" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">東京での撮影依頼を探す</a>
      </div>
    `
  },
  {
    slug: "how-to-dm-models",
    title: "カメラマン向け：SNSで被写体モデルをスカウトする時の正しい「声の掛け方」",
    description: "SNSでモデルさんに撮影依頼のDMを送る際、スルーされがちなNG文面と、返信率が劇的に上がる声の掛け方を解説します。",
    coverImage: "https://images.unsplash.com/photo-1554048665-22e391b498f3?auto=format&fit=crop&q=80",
    publishedAt: "2026-01-02T00:00:00Z",
    tags: ["カメラマン向け", "撮影依頼", "DMの送り方", "モデル探し"],
    content: `
      <h2>NGな声の掛け方</h2>
      <p>「初めまして！今度撮影させてください！」など、いつ・どこで・どんな写真を撮りたいのかが不明確なDMは警戒されます。</p>
      <h2>DMに盛り込むべき要素</h2>
      <p>挨拶の後に、必ず「自分の作例（ポートフォリオ）へのリンク」「具体的な撮影テーマ」「候補の時期とエリア」「無償か有償かの条件」を記載しましょう。</p>
    `
  },
  {
    slug: "clothing-for-portraits",
    title: "失敗しない！ポートレート撮影の服装選び",
    description: "撮影の仕上がりは「衣装」で大きく変わります。カメラ映えする色選びや、ロケーションに合わせた服の選び方。",
    coverImage: "https://images.unsplash.com/photo-1434389678369-1b5e5264b304?auto=format&fit=crop&q=80",
    publishedAt: "2026-01-08T00:00:00Z",
    tags: ["被写体向け", "ファッション", "コーディネート"],
    content: `
      <h2>原色は避け、淡い色や白を</h2>
      <p>真っ赤や蛍光色の服は肌に色が反射（色被り）してしまうため、レタッチが難しくなります。白やベージュ、淡いパステルカラーは肌をトーンアップさせるレフ板効果もあります。</p>
      <h2>ロケーションとのバランス</h2>
      <p>自然の多い公園ならナチュラルなワンピース、近代的な街中ならモードなセットアップなど、背景と服装の親和性を意識することが大切です。</p>
    `
  },
  {
    slug: "tfp-shooting-rules",
    title: "相互無償（無料）でのポートレート撮影。トラブルを防ぐための暗黙のルールとは？",
    description: "モデルとカメラマンがお互いに無償で撮影を行う「TFP」。気持ちよく撮影を終えるためのマナーとルール。",
    coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80",
    publishedAt: "2026-01-15T00:00:00Z",
    tags: ["相互無償", "マナー", "トラブル防止", "ポートレート"],
    content: `
      <h2>「無料だから」とルーズにならない</h2>
      <p>お金が発生していないからといって遅刻は絶対にNG。相手はその日のために時間を空けています。</p>
      <h2>経費の負担を明確にする</h2>
      <p>交通費やスタジオ代、飲食代は撮影前にどちらが負担するかすり合わせておきましょう。</p>
      <h2>データの納品期限</h2>
      <p>「〇日以内にLINEで送ります」と予め明言しておくのがマナーです。待たせすぎるのは不満の元になります。</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/posts/new" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">相互無償の募集をチェック</a>
      </div>
    `
  },
  {
    slug: "cafe-portrait-etiquette",
    title: "カフェでのポートレート撮影マナー：お店や他のお客さんに迷惑をかけないために",
    description: "おしゃれなカフェでの撮影は大人気ですが、一歩間違えると迷惑行為に。必ず守るべきお店での撮影マナーを解説。",
    coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80",
    publishedAt: "2026-01-22T00:00:00Z",
    tags: ["撮影 маナー", "カフェ撮影", "カメラマン向け"],
    content: `
      <h2>必ず事前に許可を取る</h2>
      <p>店内での人物メインの撮影は、入店時（または事前に電話で）「ポートレート撮影をしても良いか」を必ず確認しましょう。</p>
      <h2>他のお客さんを写さない</h2>
      <p>背景に他のお客さんの顔が写り込むのはNGです。壁越しの席を選んだり、ボケを活かしてプライバシーを守りましょう。</p>
      <h2>ワンオーダーは必須、長居はしない</h2>
      <p>撮影だけして帰るのはマナー違反です。きちんと食事やドリンクを注文し、混雑時は早めに退店しましょう。</p>
    `
  },
  {
    slug: "communication-during-shoot",
    title: "良い表情を引き出す！撮影中のコミュニケーション術",
    description: "被写体の自然な笑顔を引き出せるかどうかは、カメラマンの「声掛け」にかかっています。",
    coverImage: "https://images.unsplash.com/photo-1560205001-aefffc1f6003?auto=format&fit=crop&q=80",
    publishedAt: "2026-01-29T00:00:00Z",
    tags: ["カメラマン向け", "コミュニケーション", "撮影ノウハウ"],
    content: `
      <h2>無言は絶対NG！</h2>
      <p>シャッターを切りながら無言でいると、モデルは「ダメだったのかな？」と不安になります。「いいですね！」「その角度最高！」とポジティブな声掛けを続けましょう。</p>
      <h2>具体的な指示を出す</h2>
      <p>「もうちょっと笑って」ではなく、「面白いことを思い出して」「少しだけ口角を上げて」など、具体的にどうすれば良いかを伝えるとモデルも動きやすくなります。</p>
    `
  },
  {
    slug: "studio-vs-location",
    title: "スタジオ撮影と野外撮影の違いと、それぞれのメリット・デメリット",
    description: "ポートレートを撮るなら野外？それともスタジオ？それぞれの特徴を理解して自分のイメージに合う方を選びましょう。",
    coverImage: "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&q=80",
    publishedAt: "2026-02-05T00:00:00Z",
    tags: ["スタジオ", "ロケーション", "撮影知識"],
    content: `
      <h2>スタジオのメリット：環境がコントロールできる</h2>
      <p>天候や気温に左右されず、ストロボを使って思い通りの光を作れます。また、着替えやメイクがしやすいのも大きな利点です。ただしレンタル費用がかかります。</p>
      <h2>野外のメリット：開放感と季節感</h2>
      <p>風や太陽の光、四季折々の風景を取り入れることができ、写真にドラマチックなストーリー性が生まれます。ただし天候に左右されやすいのが難点です。</p>
    `
  },
  {
    slug: "safety-tips-for-female-models",
    title: "女性被写体必見！安全な撮影のための自己防衛ルール",
    description: "SNSで知り合ったカメラマンとの初対面撮影。安全・安心に楽しむために女性モデルが身につけておくべき防衛策。",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    publishedAt: "2026-02-12T00:00:00Z",
    tags: ["被写体向け", "安全対策", "トラブル防止"],
    content: `
      <h2>最初は必ず「昼間の屋外」で</h2>
      <p>初対面の際はいきなり個室スタジオや車での密室移動は避けましょう。大きな公園やカフェなど、人の目がある場所を指定するのが基本です。</p>
      <h2>事前に身分証やSNSをしっかり確認</h2>
      <p>相手の過去の作例だけでなく、普段のツイートの内容や、他のモデルさんからのタグ付けなどを確認し、信頼できる証拠があるかをチェックしましょう。</p>
      <h2>家族や友人に予定を共有する</h2>
      <p>「今日は〇〇駅から〇〇公園で昼まで撮影がある」と、誰かに伝えておくだけでも強力な防衛になります。</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/posts/new" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">安全に募集を探す</a>
      </div>
    `
  },
  {
    slug: "cosplay-photography-tips",
    title: "コスプレ撮影初心者向けガイド：普通のポートレートと何が違う？",
    description: "アニメやゲームのキャラクターに扮するコスプレ撮影。ライティングや構図の考え方がどう違うのかを解説します。",
    coverImage: "https://images.unsplash.com/photo-1580477667995-2b92f35311fa?auto=format&fit=crop&q=80",
    publishedAt: "2026-02-18T00:00:00Z",
    tags: ["コスプレ", "カメラマン向け", "被写体向け", "イベント撮影"],
    content: `
      <h2>キャラクターの「解釈」を大切に</h2>
      <p>コスプレ撮影では「可愛く撮る」「綺麗に撮る」以上に、「そのキャラクターらしいか」が求められます。事前に原作の表情やポーズを打ち合わせしておきましょう。</p>
      <h2>ライティングは「パキッと」が好まれる傾向</h2>
      <p>2次元のキャラクターを表現するため、自然光の柔らかい光よりも、ストロボを使ったコントラストの高い（パキッとした）ライティングが好まれることが多いです。</p>
    `
  },
  {
    slug: "indoor-home-studio",
    title: "おうちスタジオ・レンタルスペースの活用法",
    description: "本格的な白ホリスタジオを借りなくても、安価なレンタルスペースや自宅で素敵な室内ポートレートを撮る方法。",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80",
    publishedAt: "2026-02-24T00:00:00Z",
    tags: ["室内撮影", "レンタルスペース", "機材"],
    content: `
      <h2>自然光が入る大きな窓を探す</h2>
      <p>レンタルスペースを借りる際は、窓の大きさや方角（南向きなど）を確認しましょう。白いレースカーテン越しに入る光は、それだけで最高の巨大なソフトボックスになります。</p>
      <h2>生活感を消す工夫</h2>
      <p>壁の一部だけを使ってクローズアップで撮ったり、背景を布で覆い隠したりすることで、生活感を感じさせないオシャレな空間へと変化させることができます。</p>
    `
  },
  {
    slug: "natural-light-mastery",
    title: "自然光を活かした透明感ポートレートの極意",
    description: "ストロボを使わず、太陽の光だけでエモーショナルで透明感のある写真を撮るための「光の読み方」。",
    coverImage: "https://images.unsplash.com/photo-1475721025505-117ee205fbc3?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-02T00:00:00Z",
    tags: ["カメラマン向け", "自然光", "透明感", "テクニック"],
    content: `
      <h2>順光と半逆光の使い分け</h2>
      <p>モデルの顔に直接光が当たる「順光」は空が青く写りますが、顔に強い影がでます。「半逆光（モデルの斜め後ろから太陽が当たる）」で撮り、顔の暗い部分をレフ板で起こすと、髪がキラキラと光る透明感ポートレートになります。</p>
      <h2>曇りの日は「巨大なソフトボックス」</h2>
      <p>曇りの日は空全体が雲で拡散され、影のない非常に柔らかい光が降ってきます。しっとりとした物憂げなポートレートに最適です。</p>
    `
  },
  {
    slug: "spring-cherry-blossom-portraits",
    title: "春の桜ポートレート！人混みを避けるコツと構図の工夫",
    description: "大人気の桜ポトレ。人が多すぎてうまく撮れない…という悩みを解決するテクニック集。",
    coverImage: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-06T00:00:00Z",
    tags: ["春", "桜", "季節のポートレート", "撮影テクニック"],
    content: `
      <h2>見上げる構図で空と桜だけを写す</h2>
      <p>人が多い場所では、あえてローアングルから「空と桜とモデル」だけを見上げるように撮ることで、通行人を完全にカットできます。</p>
      <h2>前ボケに桜を使う</h2>
      <p>レンズのすぐ手前に桜の枝を配置し、モデルにピントを合わせると、ピンク色の華やかな「前ボケ」がフィルターのようになり、幻想的な1枚になります。</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/t/tokyo" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">桜撮影の募集を探す</a>
      </div>
    `
  },
  {
    slug: "using-props-in-portraits",
    title: "小道具を使ったポートレートアイデア集",
    description: "写真にストーリー性を持たせ、モデルの手持ち無沙汰も解消してくれる「最強の小道具」たち。",
    coverImage: "https://images.unsplash.com/photo-1544253102-1a48c66e2898?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-10T00:00:00Z",
    tags: ["アイデア", "小道具", "ポートレート企画"],
    content: `
      <h2>定番のクリア傘（ビニール傘）</h2>
      <p>雨の日はもちろん、晴れの日でも光を透過させてキラキラ光るクリア傘は非常にエモい小道具になります。</p>
      <h2>花束・ドライフラワー</h2>
      <p>顔の横に添えたり、抱きしめたりするだけで、一気に作品の完成度が上がります。</p>
      <h2>フィルムカメラ</h2>
      <p>カメラ女子という設定で、モデルに古いカメラを持たせるのも定番ながらハズレのない演出です。</p>
    `
  },
  {
    slug: "how-to-build-portfolio",
    title: "モデル・カメラマンのポートフォリオ（作例）の作り方と重要性",
    description: "SNSのタイムラインだけでは依頼は増えない？自分の魅力を100%伝えるポートフォリオのまとめ方。",
    coverImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-14T00:00:00Z",
    tags: ["ポートフォリオ", "SNS活用", "自己PR"],
    content: `
      <h2>Instagramのハイライトを活用する</h2>
      <p>Twitter(X)のメディア欄は日常のツイートで流れてしまいます。Instagramのハイライトに「自然光撮影」「スタジオ作例」などカテゴリごとに分けておくと、相手が見やすくなります。</p>
      <h2>量より「一貫性」</h2>
      <p>なんでも撮れます！という雑多な作例よりも、「透明感ならこの人」「エモい夜景ならこの人」と得意分野が伝わる9〜12枚を厳選してトップに固定しましょう。</p>
    `
  },
  {
    slug: "rainy-day-portraits",
    title: "雨の日だから撮れる！エモーショナルなポートレート",
    description: "撮影の予定が雨になってしまった…と落ち込むのはもったいない！雨の日ならではのテクニック。",
    coverImage: "https://images.unsplash.com/photo-1508609503373-cf6783d73981?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-18T00:00:00Z",
    tags: ["雨の日", "エモい", "テクニック", "カメラマン向け"],
    content: `
      <h2>濡れた路面のリフレクション（反射）</h2>
      <p>雨の日の夜などは、水溜まりや濡れたアスファルトが街灯やネオンを反射し、サイバーパンクでシネマティックな一枚が撮れます。</p>
      <h2>ストロボで雨粒を止める</h2>
      <p>モデルの背後からストロボを当てると、降っている雨粒の一つ一つが光を反射して雪のように真っ白に光り、非常にドラマチックです。</p>
      <div style="margin-top: 40px; text-align: center;">
        <a href="/posts/new" style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: white; border-radius: 9999px; text-decoration: none; font-weight: bold;">週末の撮影相手を探す</a>
      </div>
    `
  },
  {
    slug: "golden-hour-magic",
    title: "マジックアワーを極める夕景ポートレート",
    description: "日没前後のわずか数十分間しか現れない奇跡の光「マジックアワー」を逃さず撮影する方法。",
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
    publishedAt: "2026-03-20T00:00:00Z",
    tags: ["夕景", "マジックアワー", "絶景", "ライティング"],
    content: `
      <h2>シルエット撮影に挑戦する</h2>
      <p>あえて被写体に光を当てず、オレンジの美しい空を背にしてシルエット（黒いシルエット）だけでモデルの輪郭を表現すると、非常にポエティックな作品になります。</p>
      <h2>ストロボ＋カラーフィルター</h2>
      <p>モデルにストロボを当てる際、ホワイトバランスを思い切り「青」に振り、ストロボにオレンジ色のフィルター（CTO）を被せることで、夕焼けをさらに強調するハリウッド映画のようなテクニックもあります。</p>
    `
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
