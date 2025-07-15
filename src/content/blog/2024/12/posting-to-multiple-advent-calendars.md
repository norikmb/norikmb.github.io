---
title: "１つの記事で複数のアドベントカレンダーに投稿してみる"
description: ""
pubDate: "Dec 13 2024"
heroImage: "/blog/20241213.png"
isAdventCalendar2024: true
---

### Why

社内には複数のアドベントカレンダーが展開されています。パブリックなものから、社内限定の非公開なものまで様々です。

そこで、１つの記事で複数のアドベントカレンダーを担うようにすることで、少ない労力で様々なコミュニティに投稿できるようになるのではないかと考えました。

### What

アドベントカレンダーの記事を読む際は、アドベントカレンダーのページからリンクを踏んで、このページに遷移します。

どのアドベントカレンダーのページのリンクから移動したかは[`document.referrer`](https://developer.mozilla.org/ja/docs/Web/API/Document/referrer)で取得できます。

このサイトは[Astro](https://astro.build/)で作成されています。そのため、クライアントサイドの情報を元に描画するには HTML の`<script>`タグを使うことで実現可能です。

- https://docs.astro.build/ja/guides/client-side-scripts/

```ts
<div>
  <h2>
    この記事は <span id="advent-calendar"></span>の
    <span id="day"></span>日目の記事です。
  </h2>
  <p>このページにアクセスした参照元: <span id="referrer"></span></p>

  <script>
    // document.referrerを取得
    const referrer = document.referrer;
    document.getElementById("referrer")!.innerText = referrer;

    // 参照元URLが特定のURLであれば表示内容を変更
    if (referrer.includes("https://qiita.com/")) {
      document.getElementById("advent-calendar")!.innerHTML =
        `<a href="https://qiita.com/advent-calendar/2024/fujitsu">Fujitsu Advent Calendar 2024</a>`;
      document.getElementById("day")!.innerText = "13";
    } else if (referrer.includes("https://adventar.org/")) {
      document.getElementById("advent-calendar")!.innerHTML =
        `<a href="https://adventar.org/calendars/11224">refererテスト Advent Calendar 2024</a>`;
      document.getElementById("day")!.innerText = "1";
    } else {
      document.getElementById("advent-calendar")!.innerHTML = `HogeHoge`;
      document.getElementById("day")!.innerText = "N";
    }
  </script>
</div>
```

パブリックなものとして以下のアドベントカレンダーに登録してあるので、そこからこの記事に遷移することで記事１行目の文章が変わるようになるはずです。

- https://qiita.com/advent-calendar/2024/fujitsu
- https://adventar.org/calendars/11224
