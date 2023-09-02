const ri_rule = {
    "caution": "<h3>주의사항</h3><br>ex)<br>1이상 : 1을 포함한 큰 수<br>1이하 : 1을 포함한 작은 수<br>1초과 : 1을 제외한 큰 수<br>1미만 : 1을 제외한 작은 수<br><br>ex) 남자는 1로 입력, 여자는 2로 입력",
    "cols": [
        {"name": "id"},
        {"name": "1", "memo": "남자는 1<br>여자는 2"},
        {"name": "2"},
        {"name": "3", "rules": [{"value": "3", "test": "=", "dest": "5", "empty": "f"}, {"value": "3", "test": "!", "dest": "4", "empty": "t"}]},
        {"name": "3-1", "rules": [{"value": "3", "test": "=", "dest": "6", "empty": "f"}, {"value": "3", "test": "!", "dest": "3-2", "empty": "t"}]},
        {"name": "3-2"},
        {"name": "4", "rules": [{"value": "30", "test": ">=", "dest": "8", "empty": "f"}, {"value": "30", "test": "<", "dest": "7", "empty": "t"}]},
        {"name": "5"},
        {"name": "6"},
        {"name": "7"},
        {"name": "8"},
        {"name": "9", "rules": [{"value": "2", "test": "!", "dest" : "11", "empty": "t"}]},
        {"name": "9-1"},
        {"name": "9-2"},
        {"name": "9-3"},
        {"name": "10"},
        {"name": "11"},
        {"name": "12"}
    ]
};