const rm_main = {

    createTable : () => {
        // TODO: 입력한 항목수대로 테이블 생성        
    },

    initTable : () => {
        // TODO: 테이블 초기화
    },

    appendRow : () => {
        // TODO: 행 추가
    },

    createRuleFile : rule => {    
        if (!rule) {
            alert("설정 파일 저장 실패");
            return;
        }

        if (typeof rule !== 'object') {
            alert("설정 파일 저장 실패");
            return;
        }

        const jsonCode = "const ri_rule = " + JSON.stringify(rule, null, 2);
        const blob = new Blob([jsonCode], { type: "text/javascript" });
        saveAs(blob, "rule.js");
    },

    eventHandler : () => {
        
    }
};