# 数独 (Sudoku) PWA

スマホで遊べるシンプルな数独パズルアプリ。インストール不要、PWAでホーム画面追加可能。

## 機能

- **3段階の難易度**: 初級・中級・上級
- **100問ストック × 3難易度 = 300問**: 番号で選んでプレイ
- **ルームコード共有**: 同じコードを入れれば同じ問題（例: `E-100042`）
- **メモ機能**: 候補数字を小さくセル内に記録
- **タイマー**: スタートボタンで計測開始、ベストタイムを問題ごとに保存
- **数字パッドの残数表示**: 9個使い切ったら自動で無効化＋✓表示
- **答え表示**: 解答を表示（確認モーダル付き、ベスト記録対象外）
- **オフライン対応**: PWAインストール後はネット不要

## 技術スタック

- React 18 + TypeScript
- Vite + vite-plugin-pwa (Workbox)
- Zustand (状態管理 + localStorage永続化)
- Vitest + React Testing Library (139テスト)

## ローカル開発

```bash
npm install
npm run dev          # 開発サーバ起動 (http://localhost:5173)
npm test             # 全テスト実行
npm run build        # 本番ビルド (dist/)
npm run preview      # 本番プレビュー
```

## デプロイ

`main` ブランチへ push すると Vercel が自動デプロイ。

## ライセンス

MIT
