// アプリケーションで使用する定数・不変オブジェクトを管理します。

export const sample = `flowchart TB
alpha{"料理開始"}
A["じゃがいもを洗う"]
B["にんじんの上端、下端を切り落とす"]
C["玉ねぎの上端、下端を切り落とす"]
D["にんじんを洗う"]
E["玉ねぎの皮をむく"]
F["ピーラーで皮をむく"]
G["豚肩肉を一口大に切る"]
H["にんじんを半月切りにする"]
I["じゃがいもを乱切りをする"]
J["玉ねぎをくし切りにする"]
K["厚手の鍋にサラダ油を入れて熱する"]
L["焦がさないように中火で炒める"]
M["鍋に水を入れて沸騰させる"]
N[/"アクが出る"/]
O["取り除く"]
P["弱火or中火で20分煮込む"]
Q["火を止める"]
R["ルーを入れて溶かす"]
S["再度火をつけ弱火で5分煮込む"]

alpha --> A
alpha --> B
alpha --> C
B --> D
A --> F
D --> F
C --> E
F --> H
F --> I
E --> J
G --> L
H --> L
I --> L
J --> L
K --> L
L --> M
M --> N
N --はい--> O
N --いいえ--> P
O --> P
P --> Q
Q --> R
R --> S`;

export type IngredientInfo = {
    name: string;
    quantity: string;
    placeholderFood: string;
    placeholderQuantity: string;
};

export const defaultIngredientInfos: IngredientInfo[] = [
    {
        placeholderFood: "豚肉",
        placeholderQuantity: "350g",
        name: undefined,
        quantity: undefined,
    },
    {
        placeholderFood: "にんじん",
        placeholderQuantity: "1本",
        name: undefined,
        quantity: undefined,
    },
    {
        placeholderFood: "大根",
        placeholderQuantity: "1/2本",
        name: undefined,
        quantity: undefined,
    }
];

export type RecipeInfo = {
    Name: string;
    IngredientInfos: IngredientInfo[];
    IngredientInfoLength: number;
};

export const sampleRecipeInfos: RecipeInfo[] = [
    {
        Name: "カレー",
        IngredientInfos: defaultIngredientInfos,
        IngredientInfoLength: defaultIngredientInfos.length,
    },
    {
        Name: "お吸い物",
        IngredientInfos: defaultIngredientInfos,
        IngredientInfoLength: defaultIngredientInfos.length,
    }
]