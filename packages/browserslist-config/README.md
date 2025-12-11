# @movii/browserslist-config

공통으로 사용되는 Browserslist 대상들을 모아둔 패키지입니다.

## 사용법

`package.json`에서 아래와 같이 확장해서 사용할 수 있습니다.

```json
{
  "devDependencies": {
    ...
    "@movii/browserslist-config": "workspace:*",
  },
  "browserslist": ["extends @movii/browserslist-config"]
}
```
