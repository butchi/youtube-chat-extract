const minuteSet = new Set();

const getMinute = txt => {
  const splitArr = txt.split(':');

  return `${splitArr[0]}:${splitArr[1]}`;
}

const rankLen = 15;
const pickupChatLen = 3;

let timelineLi = {};
let cnt;

fetch('chat.json')
  .then(res => res.json())
  .then(json => {
    const chatArr = json;

    const groupLi = _.groupBy(chatArr, chat => Math.floor(chat.time_in_seconds / 60));

    const hotGroupArr = _(groupLi).orderBy("length", "desc").take(rankLen).orderBy(group => group[0].time_in_seconds).value();

    document.body.innerHTML += "🙌盛り上がったタイミング一覧<br>";

    hotGroupArr.forEach((hotGroup, _i) => {
      const messageArrayFilter = arr => {
        return _(arr).filter(item => item.message != null).filter(item => !item.message?.match(/[w|ｗ|草|:]/g)).orderBy("length").take(pickupChatLen).value();
      }

      const hotTime = hotGroup[0].time_text;

      const hotGroupItm = messageArrayFilter(hotGroup).map(item => `＼${item.message}／`).join(" ");

      document.body.innerHTML += `${hotTime} ${hotGroupItm}<br>`;
    })

    // スパチャの取得
    scArr = json
      .filter(item => item.money != null)
      .map((item, index) => `${item.time_text} ${item.author.name}さん ${item.money.text}`)
    ;

    document.body.innerHTML += "<br>🎁スパチャを送られた皆さん<br>";

    document.body.innerHTML += scArr.join("<br>");

    document.body.innerHTML += "<br><br>※ このコメントはYouTubeのチャットを解析した自動生成プログラムとなります。感想・要望・問題点あれば返信ください。";
  })
;
