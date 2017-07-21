//
// 動作設定
//

// キャラクター名
// 自身のキャラクター名をフルネームで入力 (ex:"Player Name")
var charaName = "Towa Twilight";

// キャラクター名表記設定
//  - 0: フルネーム表記 (Player Name)
//  - 1: イニシャル表記 (P. N.)
//  - 2: 名のみイニシャル表記 (P. Name)
//  - 3: 姓のみイニシャル表記 (Player N.)
var initial = 0;

// タイムアウトの設定
// EndCombatantしてからOverlayのデータが非表示になるまでの時間(秒)
// * 0以下に設定すると無効
// * オーバーレイの表示をリロードすると再表示されてしまう
var timeout_sec = 50;

// ペットをオーナーのDPSに含めるかどうか
// 巴術士(カーバンクル)・召喚士(エギ)・機工士(オートタレット)のみ対応
var combinePetDPS = false;


//
// 表示設定
// 

// リサイズハンドルの表示設定
// Plugins -> OverlayPlugin.dll -> Mini Parse 内設定の「移動とリサイズを制限する」に
// チェックを入れると右下のリサイズハンドルが非表示になる
