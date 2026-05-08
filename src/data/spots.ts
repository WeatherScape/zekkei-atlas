export type Difficulty = "easy" | "normal" | "hard";
export type BudgetLevel = "low" | "medium" | "high";

export type Spot = {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  tags: string[];
  bestSeason: string[];
  bestTime: string[];
  travelStyle: string[];
  difficulty: Difficulty;
  photoScore: number;
  budgetLevel: BudgetLevel;
  duration: string;
  highlights: string[];
  tips: string[];
};

export const spots: Spot[] = [
  {
    id: "ishigaki",
    name: "石垣島",
    country: "日本",
    region: "沖縄県",
    description:
      "透明度の高い海、サンゴ礁、夕日、星空まで一度に味わえる南国の絶景拠点。離島巡りの起点としても旅の自由度が高い。",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    latitude: 24.4064,
    longitude: 124.1754,
    tags: ["海", "星空", "島", "夕日", "夏", "カップル"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["夕方", "夜"],
    travelStyle: ["カップル旅", "写真旅", "アクティビティ旅"],
    difficulty: "easy",
    photoScore: 96,
    budgetLevel: "medium",
    duration: "2泊3日",
    highlights: ["川平湾の青", "サンセットビーチ", "星空フォト"],
    tips: ["日焼け止めと防水バッグは必須", "星空撮影は新月前後を狙う"]
  },
  {
    id: "hateruma",
    name: "波照間島",
    country: "日本",
    region: "沖縄県",
    description:
      "日本最南端の有人島。ニシ浜の青と、南十字星を望めるほど暗い夜空が重なる、特別感の強い離島体験。",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85",
    latitude: 24.0589,
    longitude: 123.8056,
    tags: ["海", "星空", "秘境", "島", "一生に一度"],
    bestSeason: ["夏", "秋"],
    bestTime: ["昼", "夜"],
    travelStyle: ["カップル旅", "ひとり旅", "写真旅", "一生に一度の旅"],
    difficulty: "normal",
    photoScore: 99,
    budgetLevel: "medium",
    duration: "2泊3日",
    highlights: ["ニシ浜", "南十字星", "日本最南端の碑"],
    tips: ["船の欠航リスクを見込む", "宿とレンタサイクルは早めに予約"]
  },
  {
    id: "miyako",
    name: "宮古島",
    country: "日本",
    region: "沖縄県",
    description:
      "橋でつながる島々と、抜けるような宮古ブルー。ドライブしながら複数のビーチを巡れる、海好きのための絶景アイランド。",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=85",
    latitude: 24.8056,
    longitude: 125.2811,
    tags: ["海", "島", "ドライブ", "朝日", "カップル"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["朝", "昼", "夕方"],
    travelStyle: ["カップル旅", "ドライブ旅", "写真旅"],
    difficulty: "easy",
    photoScore: 97,
    budgetLevel: "medium",
    duration: "2泊3日",
    highlights: ["伊良部大橋", "与那覇前浜", "東平安名崎"],
    tips: ["レンタカーがあると満足度が高い", "橋の上は駐停車不可"]
  },
  {
    id: "taketomi",
    name: "竹富島",
    country: "日本",
    region: "沖縄県",
    description:
      "赤瓦の集落、白砂の道、コンドイ浜の遠浅の海。小さな島に沖縄らしい時間が凝縮された、ゆったり系の絶景。",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=85",
    latitude: 24.3267,
    longitude: 124.0853,
    tags: ["海", "島", "週末旅", "写真映え", "カップル"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["朝", "夕方"],
    travelStyle: ["カップル旅", "ひとり旅", "週末旅", "写真旅"],
    difficulty: "easy",
    photoScore: 93,
    budgetLevel: "medium",
    duration: "1泊2日",
    highlights: ["赤瓦の集落", "コンドイ浜", "西桟橋の夕日"],
    tips: ["集落では静かに歩く", "日帰りでも朝早めの船が快適"]
  },
  {
    id: "kouri",
    name: "沖縄本島・古宇利島",
    country: "日本",
    region: "沖縄県",
    description:
      "古宇利大橋を渡る瞬間に広がる海のグラデーションが印象的。本島旅に組み込みやすい、ドライブ向けの絶景。",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=85",
    latitude: 26.7044,
    longitude: 128.0177,
    tags: ["海", "ドライブ", "夕日", "週末旅"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["昼", "夕方"],
    travelStyle: ["ドライブ旅", "カップル旅", "週末旅"],
    difficulty: "easy",
    photoScore: 90,
    budgetLevel: "medium",
    duration: "1泊2日",
    highlights: ["古宇利大橋", "ハートロック", "島カフェ"],
    tips: ["午後は混みやすい", "橋を渡る前後の展望ポイントが狙い目"]
  },
  {
    id: "tsunoshima",
    name: "角島大橋",
    country: "日本",
    region: "山口県",
    description:
      "コバルトブルーの海へ一直線に伸びる橋。西日本屈指のドライブ絶景として、短い旅でも強い記憶を残す。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    latitude: 34.347,
    longitude: 130.878,
    tags: ["海", "ドライブ", "週末旅", "写真映え"],
    bestSeason: ["春", "夏"],
    bestTime: ["昼", "夕方"],
    travelStyle: ["ドライブ旅", "週末旅", "写真旅"],
    difficulty: "easy",
    photoScore: 91,
    budgetLevel: "low",
    duration: "日帰り",
    highlights: ["橋の俯瞰", "角島灯台", "海沿いカフェ"],
    tips: ["晴天の正午前後が海色のピーク", "展望所からの撮影が定番"]
  },
  {
    id: "shimanami",
    name: "しまなみ海道",
    country: "日本",
    region: "広島県・愛媛県",
    description:
      "瀬戸内の島々を橋でつなぐ絶景ルート。海、島影、夕日を浴びる橋が重なり、移動そのものが目的になる。",
    image:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1600&q=85",
    latitude: 34.2608,
    longitude: 133.0806,
    tags: ["海", "島", "ドライブ", "夕日", "アクティビティ"],
    bestSeason: ["春", "秋"],
    bestTime: ["朝", "夕方"],
    travelStyle: ["ドライブ旅", "アクティビティ旅", "週末旅"],
    difficulty: "normal",
    photoScore: 92,
    budgetLevel: "low",
    duration: "1泊2日",
    highlights: ["来島海峡大橋", "多々羅大橋", "瀬戸内サンセット"],
    tips: ["自転車旅なら荷物は軽く", "島ごとのカフェ休憩を入れる"]
  },
  {
    id: "okunoshima",
    name: "大久野島",
    country: "日本",
    region: "広島県",
    description:
      "瀬戸内海に浮かぶ小さな島。穏やかな海と廃墟の気配、夕暮れの桟橋が独特の旅情をつくる。",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    latitude: 34.3092,
    longitude: 132.9933,
    tags: ["島", "夕日", "週末旅", "秘境"],
    bestSeason: ["春", "秋"],
    bestTime: ["朝", "夕方"],
    travelStyle: ["ひとり旅", "週末旅", "写真旅"],
    difficulty: "easy",
    photoScore: 84,
    budgetLevel: "low",
    duration: "日帰り",
    highlights: ["島の周回路", "桟橋の夕景", "瀬戸内の多島美"],
    tips: ["フェリー時刻を先に確認", "食料は島に渡る前に準備"]
  },
  {
    id: "tottori-dunes",
    name: "鳥取砂丘",
    country: "日本",
    region: "鳥取県",
    description:
      "日本海を背景に広がる砂の稜線。風紋、夕日、星空が別世界のような表情を見せる、国内で最も非日常な景観のひとつ。",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    latitude: 35.5396,
    longitude: 134.2289,
    tags: ["砂丘", "夕日", "星空", "週末旅", "写真映え"],
    bestSeason: ["春", "秋", "冬"],
    bestTime: ["夕方", "夜"],
    travelStyle: ["ひとり旅", "写真旅", "週末旅"],
    difficulty: "easy",
    photoScore: 88,
    budgetLevel: "low",
    duration: "1泊2日",
    highlights: ["馬の背", "風紋", "日本海に沈む夕日"],
    tips: ["砂が入らない靴が便利", "夏の日中は暑さ対策を厚めに"]
  },
  {
    id: "aso",
    name: "阿蘇",
    country: "日本",
    region: "熊本県",
    description:
      "外輪山と草千里がつくる雄大なスケール。雲海、ドライブ、火山景観が重なり、九州らしい大地の力を感じられる。",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85",
    latitude: 32.8844,
    longitude: 131.1046,
    tags: ["雲海", "ドライブ", "朝日", "山", "一生に一度"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["早朝", "昼"],
    travelStyle: ["ドライブ旅", "写真旅", "アクティビティ旅"],
    difficulty: "normal",
    photoScore: 94,
    budgetLevel: "medium",
    duration: "1泊2日",
    highlights: ["大観峰", "草千里", "ミルクロード"],
    tips: ["雲海狙いは早朝出発", "火口周辺は規制情報を確認"]
  },
  {
    id: "kamikochi",
    name: "上高地",
    country: "日本",
    region: "長野県",
    description:
      "澄んだ梓川と北アルプスの稜線が織りなす山岳リゾート。歩くだけで名画の中に入るような清涼感がある。",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    latitude: 36.2464,
    longitude: 137.6386,
    tags: ["山", "新緑", "紅葉", "朝日", "写真映え"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["朝", "昼"],
    travelStyle: ["ひとり旅", "写真旅", "アクティビティ旅"],
    difficulty: "normal",
    photoScore: 95,
    budgetLevel: "medium",
    duration: "1泊2日",
    highlights: ["河童橋", "大正池", "明神池"],
    tips: ["マイカー規制を確認", "朝の大正池は霧が出ると幻想的"]
  },
  {
    id: "shirakawago",
    name: "白川郷",
    country: "日本",
    region: "岐阜県",
    description:
      "合掌造りの集落が四季で表情を変える世界遺産。冬の雪景色は物語の中の村のような静けさをまとっている。",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
    latitude: 36.2579,
    longitude: 136.9067,
    tags: ["雪", "紅葉", "世界遺産", "週末旅"],
    bestSeason: ["秋", "冬"],
    bestTime: ["朝", "夕方"],
    travelStyle: ["カップル旅", "写真旅", "週末旅"],
    difficulty: "easy",
    photoScore: 90,
    budgetLevel: "medium",
    duration: "1泊2日",
    highlights: ["荻町城跡展望台", "ライトアップ", "合掌造り集落"],
    tips: ["冬は防寒と滑りにくい靴", "ライトアップ時期は予約制に注意"]
  },
  {
    id: "biei",
    name: "美瑛",
    country: "日本",
    region: "北海道",
    description:
      "丘陵とパッチワークの畑、青い池、雪原が季節ごとに別の顔を見せる。北海道らしい広さを静かに味わえる場所。",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    latitude: 43.5883,
    longitude: 142.4667,
    tags: ["雪", "花畑", "新緑", "ドライブ", "写真映え"],
    bestSeason: ["夏", "冬"],
    bestTime: ["朝", "夕方"],
    travelStyle: ["ドライブ旅", "写真旅", "ひとり旅"],
    difficulty: "easy",
    photoScore: 94,
    budgetLevel: "medium",
    duration: "2泊3日",
    highlights: ["青い池", "四季彩の丘", "白ひげの滝"],
    tips: ["冬は運転に慣れた人向け", "農地には立ち入らない"]
  },
  {
    id: "fuji-five-lakes",
    name: "富士五湖",
    country: "日本",
    region: "山梨県",
    description:
      "湖面越しの富士山、逆さ富士、朝焼け、星空まで狙える王道絶景。季節と時間帯で何度でも違う写真になる。",
    image:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=1600&q=85",
    latitude: 35.5013,
    longitude: 138.7654,
    tags: ["富士山", "朝日", "星空", "紅葉", "週末旅"],
    bestSeason: ["春", "秋", "冬"],
    bestTime: ["早朝", "夜"],
    travelStyle: ["カップル旅", "ドライブ旅", "週末旅", "写真旅"],
    difficulty: "easy",
    photoScore: 96,
    budgetLevel: "low",
    duration: "1泊2日",
    highlights: ["河口湖", "山中湖", "新倉山浅間公園"],
    tips: ["富士山は午前中が見えやすい", "三脚撮影は周囲に配慮"]
  },
  {
    id: "yakushima",
    name: "屋久島",
    country: "日本",
    region: "鹿児島県",
    description:
      "苔むす森、巨木、滝、海が同居する生命力の島。雨すら演出に変わる、自然没入型の旅に向いている。",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85",
    latitude: 30.3586,
    longitude: 130.5289,
    tags: ["森", "滝", "秘境", "一生に一度", "アクティビティ"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["朝", "昼"],
    travelStyle: ["ひとり旅", "アクティビティ旅", "一生に一度の旅"],
    difficulty: "hard",
    photoScore: 97,
    budgetLevel: "medium",
    duration: "3泊4日",
    highlights: ["白谷雲水峡", "縄文杉", "千尋の滝"],
    tips: ["登山装備とレインウェア必須", "体力に合わせたルート選びを"]
  },
  {
    id: "uyuni",
    name: "ウユニ塩湖",
    country: "ボリビア",
    region: "ポトシ県",
    description:
      "雨季には空と大地の境界が消える、世界屈指の一生に一度の絶景。星空と朝焼けのリフレクションが特に圧倒的。",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=85",
    latitude: -20.1338,
    longitude: -67.4891,
    tags: ["海外旅行", "星空", "朝日", "一生に一度", "写真映え"],
    bestSeason: ["冬", "春"],
    bestTime: ["早朝", "夜"],
    travelStyle: ["一生に一度の旅", "写真旅", "海外旅行"],
    difficulty: "hard",
    photoScore: 100,
    budgetLevel: "high",
    duration: "5泊7日",
    highlights: ["鏡張り", "星空リフレクション", "塩のホテル"],
    tips: ["高山病対策をする", "雨季でも鏡張りは天候次第"]
  },
  {
    id: "iceland",
    name: "アイスランド",
    country: "アイスランド",
    region: "南海岸・レイキャビク周辺",
    description:
      "滝、氷河、黒砂海岸、オーロラが短い移動範囲で連続する自然のショーケース。冬旅の非日常感が抜群。",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    latitude: 64.9631,
    longitude: -19.0208,
    tags: ["海外旅行", "滝", "雪", "オーロラ", "一生に一度"],
    bestSeason: ["冬", "秋"],
    bestTime: ["昼", "夜"],
    travelStyle: ["海外旅行", "ドライブ旅", "一生に一度の旅"],
    difficulty: "hard",
    photoScore: 99,
    budgetLevel: "high",
    duration: "5泊7日",
    highlights: ["セリャラントスフォス", "氷河湖", "オーロラ"],
    tips: ["冬道運転は慎重に", "防水防寒装備を厚めに"]
  },
  {
    id: "santorini",
    name: "サントリーニ島",
    country: "ギリシャ",
    region: "エーゲ海",
    description:
      "白い街並みと青いドーム、エーゲ海の夕日がつくる絵葉書のような島。カップル旅の特別感を最大化しやすい。",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85",
    latitude: 36.3932,
    longitude: 25.4615,
    tags: ["海外旅行", "海", "夕日", "カップル", "一生に一度"],
    bestSeason: ["春", "夏", "秋"],
    bestTime: ["夕方"],
    travelStyle: ["カップル旅", "海外旅行", "一生に一度の旅"],
    difficulty: "normal",
    photoScore: 98,
    budgetLevel: "high",
    duration: "4泊6日",
    highlights: ["イアの夕日", "白い街並み", "洞窟ホテル"],
    tips: ["夕日スポットは早めに場所取り", "夏は宿代が上がりやすい"]
  },
  {
    id: "cappadocia",
    name: "カッパドキア",
    country: "トルコ",
    region: "中央アナトリア",
    description:
      "奇岩群の上を無数の気球が昇る朝の景色が象徴的。早朝の数十分だけ訪れる幻想的な光が旅のハイライトになる。",
    image:
      "https://images.unsplash.com/photo-1533536201350-93ebe24101f5?auto=format&fit=crop&w=1600&q=85",
    latitude: 38.6431,
    longitude: 34.8289,
    tags: ["海外旅行", "朝日", "気球", "一生に一度", "写真映え"],
    bestSeason: ["春", "秋"],
    bestTime: ["早朝"],
    travelStyle: ["カップル旅", "海外旅行", "写真旅", "一生に一度の旅"],
    difficulty: "normal",
    photoScore: 99,
    budgetLevel: "high",
    duration: "4泊6日",
    highlights: ["気球フライト", "ギョレメ", "洞窟ホテル"],
    tips: ["気球は天候で中止になる", "早朝は冷えるので羽織りを用意"]
  },
  {
    id: "grand-canyon",
    name: "グランドキャニオン",
    country: "アメリカ",
    region: "アリゾナ州",
    description:
      "地層が刻んだ圧倒的なスケールの峡谷。朝日と夕日で岩肌の色が変わり、地球の時間を見ているような感覚になる。",
    image:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1600&q=85",
    latitude: 36.1069,
    longitude: -112.1129,
    tags: ["海外旅行", "朝日", "夕日", "一生に一度", "ドライブ"],
    bestSeason: ["春", "秋"],
    bestTime: ["早朝", "夕方"],
    travelStyle: ["海外旅行", "ドライブ旅", "一生に一度の旅"],
    difficulty: "normal",
    photoScore: 97,
    budgetLevel: "high",
    duration: "4泊6日",
    highlights: ["マーサーポイント", "サウスリム", "星空"],
    tips: ["朝夕は冷え込む", "日中のトレイルは水分を多めに"]
  },
  {
    id: "lapland",
    name: "ラップランド",
    country: "フィンランド",
    region: "ロヴァニエミ周辺",
    description:
      "雪原、針葉樹、ガラスイグルー、オーロラが重なる冬の夢のような目的地。静かな特別感を求める旅に合う。",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=85",
    latitude: 66.5039,
    longitude: 25.7294,
    tags: ["海外旅行", "雪", "オーロラ", "カップル", "一生に一度"],
    bestSeason: ["冬"],
    bestTime: ["夜"],
    travelStyle: ["カップル旅", "海外旅行", "一生に一度の旅"],
    difficulty: "hard",
    photoScore: 96,
    budgetLevel: "high",
    duration: "5泊7日",
    highlights: ["オーロラ", "ガラスイグルー", "雪原アクティビティ"],
    tips: ["極寒用の防寒を準備", "オーロラは連泊で確率を上げる"]
  },
  {
    id: "banff",
    name: "バンフ国立公園",
    country: "カナダ",
    region: "アルバータ州",
    description:
      "エメラルド色の湖とロッキー山脈が広がる北米屈指の自然景観。湖畔の朝と山岳ドライブが特に美しい。",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85",
    latitude: 51.4968,
    longitude: -115.9281,
    tags: ["海外旅行", "山", "湖", "朝日", "ドライブ"],
    bestSeason: ["夏", "秋"],
    bestTime: ["早朝", "昼"],
    travelStyle: ["海外旅行", "ドライブ旅", "写真旅"],
    difficulty: "normal",
    photoScore: 98,
    budgetLevel: "high",
    duration: "5泊7日",
    highlights: ["レイクルイーズ", "モレーン湖", "アイスフィールド Parkway"],
    tips: ["人気湖は早朝到着が安心", "野生動物との距離を保つ"]
  }
];

export const popularTags = [
  "星空",
  "海",
  "雲海",
  "紅葉",
  "雪",
  "滝",
  "夕日",
  "朝日",
  "島",
  "ドライブ",
  "カップル",
  "一生に一度",
  "秘境",
  "海外旅行",
  "週末旅"
];

export const seasonOptions = ["春", "夏", "秋", "冬"];
export const timeOptions = ["早朝", "朝", "昼", "夕方", "夜"];
export const travelStyleOptions = [
  "カップル旅",
  "ひとり旅",
  "ドライブ旅",
  "海外旅行",
  "週末旅",
  "写真旅",
  "アクティビティ旅",
  "一生に一度の旅"
];

export const allTags = Array.from(new Set(spots.flatMap((spot) => spot.tags))).sort();
