export type Difficulty = "easy" | "normal" | "hard";
export type BudgetLevel = "low" | "medium" | "high";

export type SpotVisualProfile = {
  catchCopy: string;
  heroImage: string;
  thumbnailImage: string;
  mapPreviewImage: string;
  themes: string[];
  colorMood: string;
  visualKeywords: string[];
  avoidKeywords: string[];
};

type BaseSpot = {
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

export type Spot = BaseSpot & SpotVisualProfile;

const baseSpots: BaseSpot[] = [
  {
    id: "ishigaki",
    name: "石垣島",
    country: "日本",
    region: "沖縄県",
    description:
      "透明度の高い海、サンゴ礁、夕日、星空まで一度に味わえる南国の絶景拠点。離島巡りの起点としても旅の自由度が高い。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kabira%20Bay%20Ishigaki%20Island21bs5s4410.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hateruma%20nishihama%201.jpg?width=1600",
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
    tips: ["船の欠航リスクを見込む", "宿と移動手段は早めに予約"]
  },
  {
    id: "miyako",
    name: "宮古島",
    country: "日本",
    region: "沖縄県",
    description:
      "橋でつながる島々と、透き通る宮古ブルー。ドライブしながら複数のビーチを巡れる、海好きのための絶景アイランド。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Yonahamaehama%20Miyakojima%20Okinawa%20Japan02bs3s4592.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Village%20in%20Taketomi%20Island%20-%20located%20at%20southwest%20Japan.jpg?width=1600",
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
    tips: ["集落では静かに歩く", "日帰りでも午前の船が快適"]
  },
  {
    id: "kouri",
    name: "沖縄本島・古宇利島",
    country: "日本",
    region: "沖縄県",
    description:
      "古宇利大橋を渡る瞬間に広がる海のグラデーションが印象的。本島旅に組み込みやすい、ドライブ向けの絶景。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nago%20Okinawa%20Kouri-Bridge-01.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tsunoshima%20Ohashi%20Bridge.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Setouchi%20Shimanami%20Kaido%20Expressway%20in%20summer%2C%20Ehime002.jpg?width=1600",
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
    tips: ["サイクリング旅なら荷物は軽く", "島ごとのカフェ休憩を入れる"]
  },
  {
    id: "okunoshima",
    name: "大久野島",
    country: "日本",
    region: "広島県",
    description:
      "瀬戸内海に浮かぶ小さな島。穏やかな海と廃墟の気配、夕暮れの桟橋が独特の旅情をつくる。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Okunoshima%202.JPG?width=1600",
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
      "日本海を背景に広がる砂の稜線。風紋、夕日、星空が異世界のような表情を見せる、国内でも非日常な景観。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tottori-Sakyu%20Tottori%20Japan.JPG?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Aso%20Kusasenri%20horses%20(52133462269).jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/150920%20Kappa-bashi%20Kamikochi%20Japan01n.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Shirakawa-go%2020170202-2.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20Pond%20(Aoiike)%20at%20Biei%2C%20Hokkaido%2C%20Japan.jpg?width=1600",
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
      "湖面越しの富士山、逆さ富士、朝焼け、星空まで狙える王道絶景。季節と時間帯で何度でも違う一枚になる。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mount%20Fuji%20from%20Lake%20Kawaguchi%2020170206.jpg?width=1600",
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
      "苔むす森、巨木、滝、海が同居する生命力の島。天気すら演出に変わる、自然没入型の旅に向いている。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Shiratani%20Unsui%20Gorge%2018.jpg?width=1600",
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
      "雨季には空と大地の境界が消える、世界屈指の一生に一度の絶景。星空と朝焼けのリフレクションが圧倒的。",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Reflection%20Salar%20de%20Uyuni.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Seljalandsfoss%20Waterfall%2C%20Iceland%2C%2020240720%201500%203096.jpg?width=1600",
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
    tips: ["夕日スポットは早めに場所取り", "夏の宿代は上がりやすい"]
  },
  {
    id: "cappadocia",
    name: "カッパドキア",
    country: "トルコ",
    region: "中央アナトリア",
    description:
      "奇岩群の上を無数の気球が舞う朝の景色が象徴的。早朝の光が旅のハイライトになる幻想的な絶景。",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Aurora%20swirl%20over%20Levi%2C%20Kittil%C3%A4%2C%20Lapland%2C%20Finland%2C%202023%20September.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lake%20Moraine-Banff%20National%20Park.jpg?width=1600",
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
    highlights: ["レイクルイーズ", "モレーン湖", "アイスフィールド・パークウェイ"],
    tips: ["人気湖は早朝到着が安心", "野生動物との距離を保つ"]
  }
];

const spotVisualProfiles: Partial<Record<string, Omit<SpotVisualProfile, "heroImage" | "thumbnailImage" | "mapPreviewImage">>> = {
  ishigaki: {
    catchCopy: "離島めぐりの起点になる、海と星空の南国ベース。",
    themes: ["海", "島", "星空"],
    colorMood: "emerald / deep blue / sunset gold",
    visualKeywords: ["川平湾", "透明な海", "サンゴ礁", "星空", "沖縄"],
    avoidKeywords: ["雪山", "ヨーロッパの街並み", "砂漠", "森林だけの風景"]
  },
  hateruma: {
    catchCopy: "日本で南十字星にいちばん近づける島。",
    themes: ["海", "島", "星空", "一生に一度"],
    colorMood: "emerald / cobalt blue / starry navy",
    visualKeywords: ["ニシ浜", "透明な海", "離島", "南国", "日本最南端", "星空"],
    avoidKeywords: ["山岳風景", "雪景色", "ヨーロッパの街並み", "都市夜景"]
  },
  miyako: {
    catchCopy: "透明すぎる海に、日常ごと溶けていく島。",
    themes: ["海", "島", "リゾート", "ドライブ"],
    colorMood: "turquoise / white sand / clean sky",
    visualKeywords: ["宮古ブルー", "白砂", "ビーチ", "橋", "南国"],
    avoidKeywords: ["雪山", "都市風景", "星空だけの写真", "森林だけの風景"]
  },
  taketomi: {
    catchCopy: "赤瓦の集落と白砂の道に、沖縄の時間が残る島。",
    themes: ["島", "集落", "海", "写真旅"],
    colorMood: "coral red / white sand / soft blue",
    visualKeywords: ["赤瓦", "竹富島", "白砂の道", "沖縄集落", "コンドイ浜"],
    avoidKeywords: ["高層ビル", "雪景色", "ヨーロッパの街並み", "砂漠"]
  },
  kouri: {
    catchCopy: "橋を渡る数分で、旅の気分が海色に変わる。",
    themes: ["海", "ドライブ", "橋"],
    colorMood: "turquoise / bridge white / summer blue",
    visualKeywords: ["古宇利大橋", "沖縄本島", "海のグラデーション", "ドライブ"],
    avoidKeywords: ["山岳湖", "雪", "都市夜景", "砂丘"]
  },
  tsunoshima: {
    catchCopy: "コバルトブルーへ一直線に伸びる、記憶に残る橋。",
    themes: ["海", "ドライブ", "橋"],
    colorMood: "cobalt blue / white bridge / summer light",
    visualKeywords: ["角島大橋", "山口県", "海へ伸びる橋", "ドライブ"],
    avoidKeywords: ["沖縄の離島", "雪山", "森林", "ヨーロッパの街並み"]
  },
  shimanami: {
    catchCopy: "橋と島影を巡る、移動そのものが旅になる道。",
    themes: ["海", "島", "ドライブ", "サイクリング"],
    colorMood: "setouchi blue / warm sunset / bridge gray",
    visualKeywords: ["瀬戸内", "しまなみ海道", "橋", "島々", "サイクリング"],
    avoidKeywords: ["熱帯ビーチだけ", "雪景色", "砂漠", "オーロラ"]
  },
  okunoshima: {
    catchCopy: "瀬戸内の静けさと夕暮れが、小さな島を旅にする。",
    themes: ["島", "瀬戸内", "夕日"],
    colorMood: "quiet blue / faded concrete / sunset amber",
    visualKeywords: ["大久野島", "瀬戸内海", "桟橋", "小さな島", "夕暮れ"],
    avoidKeywords: ["南国リゾート", "雪山", "海外都市", "砂漠"]
  },
  "tottori-dunes": {
    catchCopy: "砂の稜線と日本海がつくる、国内の非日常。",
    themes: ["砂丘", "夕日", "星空"],
    colorMood: "sand beige / navy sea / dusk orange",
    visualKeywords: ["鳥取砂丘", "砂丘", "風紋", "日本海", "夕日"],
    avoidKeywords: ["熱帯ビーチ", "森林", "雪村", "ヨーロッパの街並み"]
  },
  aso: {
    catchCopy: "草原と火山のスケールに、九州の大地を感じる。",
    themes: ["山", "草原", "ドライブ", "雲海"],
    colorMood: "grass green / volcanic black / morning mist",
    visualKeywords: ["阿蘇", "草千里", "火山", "外輪山", "雲海"],
    avoidKeywords: ["海岸", "雪景色", "海外都市", "白砂ビーチ"]
  },
  kamikochi: {
    catchCopy: "梓川と北アルプスが、歩く時間まで澄ませてくれる。",
    themes: ["山", "川", "新緑", "紅葉"],
    colorMood: "alpine green / clear river / stone gray",
    visualKeywords: ["上高地", "河童橋", "梓川", "北アルプス", "大正池"],
    avoidKeywords: ["海", "砂漠", "南国", "都市夜景"]
  },
  shirakawago: {
    catchCopy: "雪と合掌造りが、物語の中の村を現実にする。",
    themes: ["世界遺産", "雪", "歴史的建造物"],
    colorMood: "snow white / warm window light / deep brown",
    visualKeywords: ["白川郷", "合掌造り", "雪景色", "世界遺産", "集落"],
    avoidKeywords: ["熱帯ビーチ", "砂漠", "高層ビル", "海岸"]
  },
  biei: {
    catchCopy: "丘と青い池が、北海道の余白を静かに見せる。",
    themes: ["北海道", "丘", "青い池", "雪"],
    colorMood: "aoiike blue / snow white / field green",
    visualKeywords: ["美瑛", "青い池", "丘陵", "北海道", "雪原"],
    avoidKeywords: ["沖縄の海", "砂漠", "海外都市", "南国"]
  },
  "fuji-five-lakes": {
    catchCopy: "湖面に映る富士山が、朝の旅を特別にする。",
    themes: ["富士山", "湖", "朝日", "星空"],
    colorMood: "fuji blue / lake reflection / dawn pink",
    visualKeywords: ["富士五湖", "富士山", "河口湖", "逆さ富士", "朝焼け"],
    avoidKeywords: ["南国ビーチ", "海外都市", "砂丘", "オーロラ"]
  },
  yakushima: {
    catchCopy: "苔むす森で、自然に深く入り込む島旅。",
    themes: ["森", "島", "滝", "一生に一度"],
    colorMood: "moss green / rain forest / deep shadow",
    visualKeywords: ["屋久島", "苔むす森", "白谷雲水峡", "縄文杉", "滝"],
    avoidKeywords: ["白砂ビーチだけ", "雪山", "都市風景", "砂漠"]
  },
  uyuni: {
    catchCopy: "空と地面の境界が消える、人生で一度は見たい鏡の世界。",
    themes: ["海外", "一生に一度", "鏡張り", "非日常"],
    colorMood: "salt white / sky blue / pale violet",
    visualKeywords: ["ウユニ塩湖", "Salar de Uyuni", "鏡張り", "塩湖", "空の反射", "ボリビア"],
    avoidKeywords: ["海岸", "森林", "日本の湖", "普通の砂漠", "南国ビーチ"]
  },
  iceland: {
    catchCopy: "地球じゃないみたいな景色を走る旅。",
    themes: ["海外", "大自然", "ドライブ", "滝", "オーロラ"],
    colorMood: "cold blue / moss green / black lava / ice white",
    visualKeywords: ["アイスランド", "滝", "火山地形", "氷河", "黒砂海岸", "オーロラ"],
    avoidKeywords: ["tropical beach", "Japanese shrine", "Mediterranean town", "南国リゾート"]
  },
  santorini: {
    catchCopy: "白い街と青い海が、夕暮れに映画みたいに染まる島。",
    themes: ["海外", "島", "街歩き", "夕日"],
    colorMood: "white wall / aegean blue / sunset gold",
    visualKeywords: ["サントリーニ島", "白い街並み", "青いドーム", "エーゲ海", "夕日"],
    avoidKeywords: ["雪山", "熱帯ジャングル", "日本の集落", "砂漠"]
  },
  cappadocia: {
    catchCopy: "奇岩の空に、気球が浮かぶ朝を見に行く。",
    themes: ["海外", "気球", "奇岩", "一生に一度"],
    colorMood: "rose beige / dawn gold / balloon colors",
    visualKeywords: ["カッパドキア", "気球", "奇岩", "朝焼け", "トルコ"],
    avoidKeywords: ["海岸", "雪山", "日本庭園", "都市夜景"]
  },
  "grand-canyon": {
    catchCopy: "地層の深さに、時間のスケールを思い出す。",
    themes: ["海外", "渓谷", "夕日", "一生に一度"],
    colorMood: "red rock / desert orange / deep shadow",
    visualKeywords: ["グランドキャニオン", "渓谷", "赤い岩", "アメリカ", "夕日"],
    avoidKeywords: ["海", "森林だけ", "雪村", "ヨーロッパの街並み"]
  },
  lapland: {
    catchCopy: "雪原の夜空に、オーロラが静かに揺れる。",
    themes: ["海外", "雪", "オーロラ", "一生に一度"],
    colorMood: "aurora green / snow white / polar night",
    visualKeywords: ["ラップランド", "オーロラ", "雪原", "フィンランド", "冬"],
    avoidKeywords: ["南国ビーチ", "砂漠", "地中海", "都市昼景"]
  },
  banff: {
    catchCopy: "エメラルドの湖とロッキー山脈を巡る、北米の大自然。",
    themes: ["海外", "湖", "山", "ドライブ"],
    colorMood: "emerald lake / alpine blue / rock gray",
    visualKeywords: ["バンフ", "モレーン湖", "ロッキー山脈", "カナダ", "湖"],
    avoidKeywords: ["熱帯ビーチ", "砂漠", "日本の街並み", "地中海"]
  }
};

function attachVisualProfile(spot: BaseSpot): Spot {
  const profile = spotVisualProfiles[spot.id];
  if (!profile) {
    return {
      ...spot,
      catchCopy: spot.highlights[0] || spot.description,
      heroImage: spot.image,
      thumbnailImage: spot.image,
      mapPreviewImage: spot.image,
      themes: spot.tags.slice(0, 3),
      colorMood: "deep navy / soft blue",
      visualKeywords: [spot.name, spot.region, ...spot.tags],
      avoidKeywords: ["unrelated stock image", "generic landscape"]
    };
  }

  return {
    ...spot,
    ...profile,
    heroImage: spot.image,
    thumbnailImage: spot.image,
    mapPreviewImage: spot.image
  };
}

export const spots: Spot[] = baseSpots.map(attachVisualProfile);

export const spotVisualIntegrity = spots.map((spot) => ({
  id: spot.id,
  name: spot.name,
  image: spot.image,
  visualKeywords: spot.visualKeywords,
  avoidKeywords: spot.avoidKeywords
}));

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

export const allTags = Array.from(new Set(spots.flatMap((spot) => spot.tags))).sort((a, b) =>
  a.localeCompare(b, "ja")
);
