const minuteSet = new Set();

const getMinute = txt => {
  const splitArr = txt.split(':');

  return `${splitArr[0]}:${splitArr[1]}`;
}

let timelineLi = {};
let cnt;

fetch('chat.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    json
      .map(item => {
        if (timelineLi[getMinute(item.time_text)]) {
          timelineLi[getMinute(item.time_text)].push(item);
        } else {
          if (item.time_in_seconds >= 0) {
            timelineLi[getMinute(item.time_text)] = [];
          }
        }
      })
    ;

    const minChat = 5;
    const rankLen = 15;

    const hotTimeArr = _.orderBy(Object.keys(timelineLi), time => timelineLi[time].length, "desc");

    const topTimeArr = hotTimeArr.filter(item => timelineLi[item].length >= minChat).slice(0, rankLen);

    const selectTopChat = time => {
      const temp = timelineLi[time].filter(item => !item.message?.match(/[草|w|ｗ]/g))

      return _.orderBy(temp, item => item.message?.length).slice(0, 3)
    }

    const outputArr = topTimeArr.sort().map(time => [time + ':00', selectTopChat(time).map(item => `＼${item.message}／`).join(" ")].join(" "))

    document.body.innerHTML += "🙌盛り上がったタイミング一覧<br>";

    document.body.innerHTML += (outputArr.join('<br>'));

    // スパチャの取得
    scArr = json
      .filter(item => item.money != null)
      .map((item, index) => `${item.time_text} ${item.author.name}さん ${item.money.text}`)
    ;

    document.body.innerHTML += "<br><br>🎁スパチャを送られた皆さん<br>";

    document.body.innerHTML += scArr.join("<br>");

    document.body.innerHTML += "<br><br>※ このコメントはYouTubeのチャットを解析した自動生成プログラムとなります。感想・要望・問題点あれば返信ください。";
  })
;
