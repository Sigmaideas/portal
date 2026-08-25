# SIGMA IDEAS 경영 포탈

매일 아침 여기서 하루를 시작하기 위한 **경영도구 통합 포탈**입니다.
날짜·시간·현재 위치 날씨, 하루에 한 번 바뀌는 경영 명언, 그리고 4개 대시보드로 가는 링크가 한 화면에 있습니다.

**배포 주소 — https://sigmaideas.github.io/portal/**

## 대시보드 구성

회사 → 기능 순으로 묶여 있습니다. 아직 대시보드가 없는 자리는 점선 카드(`card-empty`)로 표시하고 링크를 걸지 않습니다.

### 엑스와이지 (XYZ, Inc.)

| 기능 | 대시보드 | 주소 |
| --- | --- | --- |
| 기술 | IP 통합 관리 | [xyz-ip-dashboard](https://sigmaideas.github.io/xyz-ip-dashboard/) |
| 인사 | — | 준비 중 |
| 사업 | 로봇 판매 현황 | [robot-sales-dashboard](https://sigmaideas.github.io/robot-sales-dashboard/) |
| 브랜드 | — | 준비 중 |

### 라운지엑스 (LOUNGE'X)

| 기능 | 대시보드 | 주소 |
| --- | --- | --- |
| 사업 | P&L 손익 관리 | [loungex-pnl-dashboard](https://sigmaideas.github.io/loungex-pnl-dashboard/) |
| 브랜드 | 리뷰 모니터링 | [loungex-brand-dashboard](https://sigmaideas.github.io/loungex-brand-dashboard/) |

준비 중인 자리에 대시보드가 생기면 `index.html` 의 해당 `<div class="card card-empty">` 를
`<a class="card" href="...">` 로 바꾸고 `card-go` 화살표만 다시 넣으면 됩니다.
아이콘 색은 `card-empty` 를 떼는 순간 원래 색으로 돌아옵니다.

## 구성

```
index.html   레이아웃
style.css    디자인 토큰 (loungex-brand-dashboard 와 동일 계열)
quotes.js    경영 명언 목록
script.js    시계 / 명언 선택 / 날씨
```

빌드 과정이 없는 정적 페이지입니다. `main` 에 푸시하면 GitHub Pages 가 그대로 배포합니다.

## 동작 방식

- **날씨** — [Open-Meteo](https://open-meteo.com/) (API 키 불필요). 브라우저 위치 권한을 허용하면 현재 위치, 거부하거나 5초 안에 응답이 없으면 서울 기준으로 표시합니다. 지역명은 BigDataCloud 역지오코딩으로 채우고, 실패해도 날씨 자체는 그대로 나옵니다.
- **명언** — `quotes.js` 목록에서 "1970-01-01 이후 경과 일수 % 명언 개수" 로 고릅니다. 같은 날에는 새로고침해도 같은 문장이 나오고 자정에 다음 문장으로 넘어갑니다. 현재 79개라 약 2.6개월 주기로 순환합니다.

## 명언 추가하기

`quotes.js` 배열 **끝에** 항목을 붙이면 기존 순서가 흔들리지 않습니다.

```js
{ t: "명언 본문.", a: "출처" },
```
