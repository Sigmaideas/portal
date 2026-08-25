# SIGMA IDEAS 경영 포탈

매일 아침 여기서 하루를 시작하기 위한 **경영도구 통합 포탈**입니다.
날짜·시간·현재 위치 날씨, 하루에 한 번 바뀌는 경영 명언, 그리고 4개 대시보드로 가는 링크가 한 화면에 있습니다.

**배포 주소 — https://sigmaideas.github.io/portal/**

## 연결된 대시보드

| 대시보드 | 주소 | 내용 |
| --- | --- | --- |
| IP 통합 관리 | [xyz-ip-dashboard](https://sigmaideas.github.io/xyz-ip-dashboard/) | 특허·상표·디자인·저작권 보유 현황과 기술평가 |
| 브랜드 · 리뷰 모니터링 | [loungex-brand-dashboard](https://sigmaideas.github.io/loungex-brand-dashboard/) | 라운지엑스 매장 리뷰 수집, 감성 분포, 월간 활성도 |
| P&L 손익 관리 | [loungex-pnl-dashboard](https://sigmaideas.github.io/loungex-pnl-dashboard/) | 라운지엑스24h 지점별 매출·투자·회수 및 회사 손익 |
| 로봇 판매 현황 | [robot-sales-dashboard](https://sigmaideas.github.io/robot-sales-dashboard/) | 월별 로봇 판매량 시각화와 모델별 실적 비교 |

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
