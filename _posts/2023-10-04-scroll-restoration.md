---
title: nextjsでスクロール位置が保持されない
toc: false
---

ページ遷移してからバックで戻ってもスクロール位置が保持されなくて辛い。

## 調べたこと

HistoryAPIが関係してそう？

next.config.jsでscrollRestorationをtrueにしているが動いていない。コンポーネントを表示する際にローディングコンポーネントを出した後に検索結果を表示しているため高さが合わずスクロール位置を変えてくれないのだと思う。

実際にローディング処理を消せばちゃんとスクロール位置が保持される。またuseEffectで毎回fetchする際にloadingのstateをtrueにしているためおそらくこれが原因。

## どうやって治す？

これの[gist](https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81)で実装して見た。

Reduxに保持するとか考えたけど、useEffectだけだと対応できないのと結局historyのイベント取得しないと発火させれないため難しそう。

基本的にはscrollRestorationがあればいいはず。長いものには巻かれろってことで遷移した時のスクロール保持を独自実装したくはない。

### Linkコンポーネントにもscrollのオプションはあるけどこれはなに？

探しているうちに、Linkコンポーネントや、routerにscrollオプションがあるとわかった。
もしかしたら特定のものだけ保持したりするみたいな設定ができるの？
Linkを踏んだり、router.pushしたタイミングでもx,yを保存するイベントが発生するんじゃ無いかな。

これはまだちゃんと調べてないので分からない。
{: .notice--info}

結局どう解決したか

Gistのやり方で一応は解決できた。ただ、レンダリングする際に遅延させないとスクロールの位置が復元されなくてネットワークの環境によっては安定しない。またそれにも対応するために遅延を入れると表示されてからスクロールされてUXも悪い。
難しいけど、みた感じイベントでその時のスクロール位置をパスをキーにしてsessionStorageに保管して戻る時とかに呼び出してるっぽい。
他にも原因ありそうだなってところが最初に書いた、ローディングのコンポーネントを表示していること。

これはRTKQueryに変えてみて動くのは確認したけど他に影響範囲が大きすぎてリグレッションがやばそうなので諦めた。時間があればやりたいな。useEffectで書くよりもだいぶスッキリするし、StoreのStateに突っ込んで他のところから変に変えられなかったりキャッシュしてくれたりとフェッチの管理がasyncThunkよりもだいぶ楽になる。

内部でasyncThunk使ってるみたい。
{: .notice--warning}

## 参考に見たの

Zenn

- [Next.jsはどうやってスクロール位置を復元するのか](https://zenn.dev/akfm/articles/next-js-scroll-restore)

これは実装をある程度わかりやすく説明してくれてるのでこれ理解できるとだいぶ話早そう

reddit

- [scroll_in_next_js](https://www.reddit.com/r/nextjs/comments/xgpdwm/scroll_in_next_js/)
- [pressing_the_back_button_on_browsers_will_scroll](https://www.reddit.com/r/nextjs/comments/t7xgt0/pressing_the_back_button_on_browsers_will_scroll/)

Nextjs Link Component scroll props

- [Link](https://nextjs.org/docs/pages/api-reference/components/link#scroll)
- [useRouter](https://nextjs.org/docs/pages/api-reference/functions/use-router#routerpush)

scroll: trueってややこしいけど、これスクロールの位置をリセットするかどうかって感じ？
だからtrueで保持しない、falseで保持するになるのかな？

ブログ

- [Scroll restoration in Next.js](https://mmazzarolo.com/blog/2021-04-10-nextjs-scroll-restoration/)
- [next/router を使ってページ遷移する時にスクロール位置を保持する](https://www.gaji.jp/blog/2022/03/18/9348/)
- [【Next.js】ブラウザバック時にスクロール位置を強制的に元に戻す](https://zenn.dev/catnose99/scraps/f9b00c9acf81b4)
