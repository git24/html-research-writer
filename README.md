# 설문결과 입력 프로그램

## 개요

수기로 작성된 리서치 결과지를 엑셀 파일로 취합하기 위한 입력 프로그램. 기존은 단순 입력 프로그램을 사용했고 어떤 방식으로 개발 됐는지 알 수 없으며 전문 인력만 사용 가능하기에 사용에 제약이 많고 해당 프로그램을 사용하는 인력이 제한적이고 배포할 수 없어 업무 딜레이와 인력 제한이 상당하다. 이를 개선하기 위해 직관적인 UI 와 제한된 입력 규칙으로 입력 실수를 줄이고 프로그램 배포/사용이 쉽게 HTML 로 개발하여 누구나 어떤 환경에서든 사용할 수 있도록 한다. 시험 단계에선 기존 인력도 사용할 수 있도록 유사한 기능을 제공, 최종적으로는 누구나 쉽게 입력할 수 있도록 하는 것이 목표.

## 기본 제약 조건

모든 설문결과는 숫자로만 입력되며 결과가 서술형이거나 문자로 입력되어도 유형에 따라 숫자코드로 변환하여 입력하게 된다. 하여 모든 설문결과는 숫자로만 입력되어야 한다. 단, 엑셀 결과지에는 모두 문자열로 입력되게 처리

> 숫자 : 0을 포함한 자연수

## 필수요건

### 1.1. 구분자(스페이스,쉼표)로 구분된 설문결과 입력

> 입력 예시1: 1,2,3,4,5,2,1,2,3

> 입력 예시2: 1 2 3 4 5 2 1 2 3

### 1.2. 항목별로 입력이 분리된 입력폼 제공

컬럼이 같이 표시되어 현재 어느 항목을 입력하고 있는지 직관적으로 알 수 있어야 한다.

| 1 | 1-1 | 1-2 | 2 | 3 | 3-1 |
|--------|--------|--------|--------|--------|--------|
| 3   | 2   | 1   | 4   | 2   | 5   |


### 1.3. 입력 후 결과 표시

### 1.4. 입력 결과 엑셀로 다운로드

### 1.5. 입력 규칙 적용

#### 1.5.1. 판단 조건

> 설문결과를 x 라고 하고 특정 값을 y 라고 했을때, 판단 조건 유형

- x = y : 설문결과가 y 일 경우
- x ! y : 설문결과가 y 가 아닌 경우
- x \> y : 설문결과가 y 초과인 경우
- x < y : 설문결과가 y 미만인 경우
- x \>= y : 설문결과가 y 이상인 경우
- x <= y : 설문결과가 y 이하인 경우

#### 1.5.2. 조건 만족 시 처리

> 판단 조건을 만족하는 경우 처리 내용

- 지정 항목은 결과가 있어야 한다 (예, 1번 항목에 3으로 응답 시 3번 항목은 결과가 있어야 한다)
- 지정 항목은 결과가 있을 수 없다 (예, 1번 항목에 3으로 응답 시 3번 항목은 결과가 있을 수 없다)

#### 1.5.3. 입력 조건을 만족하지 않을 경우 어떤 조건에 위배 되었는지 표시

---

## 설문결과 조건 설정

설문결과 항목 개수와 입력 규칙을 설정, 설정된 결과를 JSON 으로 출력하여 설문결과 입력 HTML 코드를 직접 수정해서 배포할 수 있도록 한다. 배포의 편의성을 위해 파일 1개로 처리하고 있으나 파일을 분리하고 입력규칙 설정 파일을 간소화해야 실수가 없을 것으로 예상됨.

---
## 업데이트 노트

### 23.08.31

**설문결과 입력**
- 입력 결과 수정을 위해 입력 후 입력박스 초기화 여부 선택할 수 있도록 적용
- 잘못 입력된 내용 수정을 편하게 하기 위해 입력 박스에 아무것도 입력된게 없을 경우, 리스트에서 항목 클릭 시 입력 박스에 선택한 내용 출력
 

**설문결과 입력 규칙 설정**