const ri_rule = {
    "caution": "<h3>주의사항</h3>ex)<br>1이상 : 1을 포함한 큰 수<br>1이하 : 1을 포함한 작은 수<br>1초과 : 1을 제외한 큰 수<br>1미만 : 1을 제외한 작은 수<br><br>ex) 남자는 1로 입력, 여자는 2로 입력",
    "cols": [
        {"name": "id"},
        {"name": "1"},
        {"name": "2"},
        {"name": "3", "rules": [{"value": "3", "test": "=", "to": "5"," empty": "4"}, {"value": "3", "test": "!", "to": "4", "empty": "5"}]},
        {"name": "3-1", "rules": [{"value": "3", "test": "=", "to": "6"}, {"value": "3", "test": "!", "empty": "3-2"}]},
        {"name": "3-2"},
        {"name": "4", "rules": [{"value": "30", "test": ">=", "to": "8", "empty": "7"}, {"value": "30", "test": "<", "to": "7", "empty": "8"}]},
        {"name": "5"},
        {"name": "6"},
        {"name": "7"},
        {"name": "8"},
        {"name": "9", "rules": [{"value": "2", "test": "!", "empty": "11"}]},
        {"name": "9-1"},
        {"name": "9-2"},
        {"name": "9-3"},
        {"name": "10"},
        {"name": "11"},
        {"name": "12"}
    ]
};