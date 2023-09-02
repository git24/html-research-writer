const ri_main = {
    s2ab(s) { 
        // ref : https://redstapler.co/sheetjs-tutorial-create-xlsx/
        const buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;    
    },

    fixedForm : () => {
        const divHeight = $(".top-fixed").height() + 21;
        $(".content").css({
            "padding-top" : divHeight + "px"
        });

        $(".tbl-result th").css({
            "top" : divHeight + "px"
        });
    },

    makeRuleMessages : (rules) => {
        if (!rules) {
            return [];
        }

        const msgs = [];
        for (let i = 0; i < rules.length; i++) {
            let msg = String(rules[i].value);

            switch (rules[i].test) {
                case "=":
                    msg += " 이면";
                    break;
                case "!":
                    msg += " 아니면";
                    break;
                case ">":
                    msg += " 초과";
                    break;
                case "<":
                    msg += " 미만";
                    break;
                case ">=":
                    msg += " 이상";
                    break;
                case "<=":
                    msg += " 이하";
                    break;
            }

            const dest = rules[i].dest === undefined ? "" : String(rules[i].dest);
            const empty = rules[i].empty === undefined ? "f" : String(rules[i].empty);

            if (dest.length > 0 && (empty == "t" || empty == "f")) {
                msg += " " + dest + " 항목 " + (empty == "t" ? "입력X" : "필수입력");
            }

            msgs.push(msg);
        }
        return msgs;
    },

    initFormTableHead : () => {
        // 입력 폼 테이블 thead 설정
        const newRow = $("<tr>");
        const newMsg = $("<tr>");
        const newMemo = $("<tr>");
        ri_rule.cols.forEach(col => {
            newRow.append($("<th>").append(col.name));            

            const headMsg = $("<th>").addClass("tbl-head-message");            
            if (col.rules) {
                let msgs = ri_main.makeRuleMessages(col.rules);
                for (let i = 0; i < msgs.length; i++) {
                    headMsg.append($("<p>").append(msgs[i]));
                }
            }
            newMsg.append(headMsg);

            newMemo.append($("<th>").addClass("tbl-head-memo").append(col.memo ? col.memo : ""));
        });
        $(".tbl-input thead").append(newRow).append(newMsg).append(newMemo);
    },

    initFormTableBody : () => {
        // 입력 폼 테이블 tbody 설정
        const newRow = $("<tr>");
        ri_rule.cols.forEach(e => {
            newRow.append($("<td>").append($("<input>", {type: "number", class: "input-box", min: 0, step: 1})));
        });
        $(".tbl-input tbody").append(newRow);
    },

    initResultTable : () => {
        // 입력 결과 테이블 설정
        const newRow = $("<tr>");
        newRow.append($("<th>").text("구분"));
        newRow.append($("<th>").text("검증"));
        ri_rule.cols.forEach(e => {
            newRow.append($("<th>").text(e.name));
        });
        $(".tbl-result thead").append(newRow);
    },

    initCautionBox : () => {
        // 주의 상자 설정
        const caution = ri_rule.caution === undefined ? "" : String(ri_rule.caution);
        if (caution.length > 0) {
            $("#caution").append(caution).removeClass("hidden");
        }
    },

    clearForm : () => {
        $(".tbl-input tr input, .input-form-box").val("");
        $(".tbl-input thead tr").each(function() {
            $(this).find("th").removeClass("tbl-illegal-col");
        });
        $(".tbl-input tbody tr").each(function() {
            $(this).find("td").removeClass("tbl-illegal-col");
        });
    },
    
    findRuleIndex : (name) => {
        if (name === undefined || name.length == 0) {
            return;
        }

        for (let i = 0; i < ri_rule.cols.length; i++) {
            if (ri_rule.cols[i].name == name) {
                return i;
            }
        }
        ri_rule.cols
        return;
    },

    isPassRuleTest : (value, rule) => {
        switch (rule.test) {
            case "=":
                return parseInt(value) == parseInt(rule.value);
            case "!":
                return parseInt(value) != parseInt(rule.value);
            case ">":
                return parseInt(value) > parseInt(rule.value);
            case "<":
                return parseInt(value) < parseInt(rule.value);
            case ">=":
                return parseInt(value) >= parseInt(rule.value);
            case "<=":
                return parseInt(value) <= parseInt(rule.value);
        }
        return true;
    },

    findIllegalIndex : (values) => {
        // TODO: 룰 검증
        for (let i = 0; i < ri_rule.cols.length; i++) {
            const rules = ri_rule.cols[i].rules;
            if (rules && rules.length > 0) {
                // TODO: 룰 검증...
            }
        }                
        // return 11;
        return -1;
    },

    drawIllegalFormTable : idx => {
        // 틀린 열 표시
        $(".tbl-input thead tr").each(function() {
            $(this).find("th:eq("+ idx +")").addClass("tbl-illegal-col");
        });

        $(".tbl-input tbody tr").each(function() {
            $(this).find("td:eq("+ idx +")").addClass("tbl-illegal-col");
        });

        // 스크롤 처리
        const targetColumn = $(".tbl-input thead th:nth-child(" + (idx + 1) + ")");
        const container = $(".overflow");
        const targetScrollLeft = targetColumn.position().left + container.scrollLeft();

        container.animate({
            scrollLeft: targetScrollLeft
        }, 500);
    },

    appendResultTableRow : (values, options) => {
        // 첫번째는 삭제 버튼
        const newRow = $("<tr>");
        const $delRow = $("<a>").addClass("button").attr("href", "#").text("삭제").click(function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
        });
        newRow.append($("<td>").append($delRow));

        // 룰 검증 처리
        const illegalIdx = ri_main.findIllegalIndex(values);
        if (illegalIdx != -1) {
            // 업로드가 아니면 한줄 추가이므로 메시지 처리
            const optionType = (options === undefined || options.type === undefined) ? "" : String(options.type);
            if (optionType != "upload") {
                let msgs = ri_main.makeRuleMessages(ri_rule.cols[illegalIdx].rules);
                $("#illegal").val(msgs.join(" | "));

                ri_main.drawIllegalFormTable(illegalIdx);
            }
            newRow.append($("<td>").addClass("rule-invalid").append("FALSE"));            
        } else {
            newRow.append($("<td>").append("TRUE"));
        }        

        // 입력 데이터 행 생성
        for (let i = 0; i < ri_rule.cols.length; i++) {
            if (i < values.length) {
                if (typeof values[i] === "string") {
                    values[i] = values[i].trim()
                }
                newRow.append($("<td>").text(values[i]));
            } else {
                newRow.append($("<td>"));
            }
        }

        // 행 클릭 이벤트 추가
        newRow.click(function() {
            // 입력된 내용이 없어야만 진행
            if (!ri_main.isFormEditorEmpty()) {
                return;
            }

            // 클릭된 로우 값 가져오기
            const tableRows = [];
            $(this).find("td").map(function(index) {
                // 삭제, 검증 컬럼 제외
                if (index > 1) {
                    tableRows.push(String($(this).text()).trim());
                }
            });

            $("#separatorBox").val(tableRows.join($("#separator").val()));
            $(".input-box").map(function(index) {
                if (index < tableRows.length) {
                    $(this).val(tableRows[index]);
                }
            });
        });

        // 생성된 행 추가
        const lastRow = $(".tbl-result tbody tr:last");
        if (lastRow.length) {
            lastRow.after(newRow);
        } else {
            // 테이블에 행이 없는 경우, tbody 내부에 직접 추가합니다.
            $(".tbl-result tbody").append(newRow);
        }
    },

    scrollToEnd : () => {
        // 입력한 결과 확인을 위해 끝으로
        const windowHeight = $(window).height();
        const scrollHeight = $("body").height() - windowHeight;
        window.scrollTo({
            top: scrollHeight,
            behavior: "smooth"
        });
    },

    triggerAppendTableRow : (values, options) => {
        if (!(values && values.length > 0)) {
            return;
        }

        ri_main.appendResultTableRow(values, options);

        if ($("#autoInit").prop("checked")) {
            ri_main.clearForm();
        }

        if (!(options && options.type && options.type == "upload")) {
            ri_main.scrollToEnd();
        }        
    },

    isEmptyValue : values => {
        if (!(values && values.length > 0)) {
            return true;
        }

        for (let i = 0; i < values.length; i++) {
            if (values[i].length > 0) {
                return false;
            }
        }

        return true;
    },

    isFormEditorEmpty: () => {
        let separator = $("#separatorBox").val().trim();
        let inputBoxs = ri_main.getFormTableValues().join("");
        return separator.length == 0 && inputBoxs.length == 0;
    },

    getResultTableRows : () => {
        const theadRows = [];
        $("#sheet1 thead th").each(function() {
            const value = String($(this).text());
            if (value != "구분") {
                theadRows.push(value);
            }
        });

        const tbodyRows = [];
        $("#sheet1 tbody tr").each(function() {
            const row = [];
            $(this).find("td").each(function() {
                const value = String($(this).text());
                if (value != "삭제") {
                    row.push(value);
                }
            });
            tbodyRows.push(row);
        });

        tbodyRows.unshift(theadRows)
        return tbodyRows;
    },

    getSeparatorValues : () => {
        const value = $("#separatorBox").val();
        if (value.length == 0) {
            return [];
        }

        const separator = $("#separator").val();
        return value.split(separator);
    },

    getFormTableValues : () => {
        const values = [];
        $(".input-box").each(function() {
            values.push(String($(this).val()).trim());
        });
        return values;
    },

    getNowDateTimeString : () => {
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDateTime.getDate().toString().padStart(2, '0');
        const hours = currentDateTime.getHours().toString().padStart(2, '0');
        const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
        const str = `${year}${month}${day}_${hours}${minutes}`;
        return str;
    },

    eventHandler : {
        onClickInput : () => {           
            const values = ri_main.getSeparatorValues();
            if (ri_main.isEmptyValue(values)) {
                return;
            }
            ri_main.triggerAppendTableRow(values);
        },

        onClickDownload : () => {
            const tableRows = ri_main.getResultTableRows();
            if (tableRows.length < 1) {
                alert("저장할 내용이 없습니다.");
                return;
            }

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(tableRows);

            for (let key in worksheet) {
                if (worksheet.hasOwnProperty(key) && worksheet[key].t === "n") {
                    worksheet[key].t = "s";
                    worksheet[key].v = String(worksheet[key].v);
                }
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
            const workbookFile = XLSX.write(workbook, {bookType:'xlsx',  type: 'binary'});
            saveAs(new Blob([ri_main.s2ab(workbookFile)],{type:"application/octet-stream"}), "research_"+ ri_main.getNowDateTimeString() +".xlsx");
        },

        onClickUpload : () => {
            // 테이블 초기화 후 진행되므로 경고
            if ($(".tbl-result tbody tr").length > 0 && !confirm("현재까지 입력된 내용이 초기화 됩니다.\n계속 하시겠습니까?")) {
                return;
            }

            const fileInput = document.getElementById('excelUpload');
            const file = fileInput.files[0];

            if (!file) {
                return;
            }

            $(".tbl-result tbody").empty();

            const reader = new FileReader();
            reader.onload = e => {
                const data = e.target.result;
                const workbook = XLSX.read(data, {type: 'binary'});
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // 시트 내의 셀 범위 계산 (A1 형식)
                const range = XLSX.utils.decode_range(worksheet['!ref']);                

                // 각 셀을 순회하며 데이터 추출
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    const values = [];
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        // 검증 컬럼 제외
                        if (col > 0) {
                            const cellAddress = XLSX.utils.encode_cell({r: row, c: col});
                            const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : undefined;
                            values.push(cellValue);
                        }
                    }
                    ri_main.triggerAppendTableRow(values, {type: "upload"});
                }
            };
            reader.readAsBinaryString(file);
        },

        onClickFormInput : () => {
            const values = ri_main.getFormTableValues();
            if (ri_main.isEmptyValue(values)) {
                return;
            }
            ri_main.triggerAppendTableRow(values);         
        },

        onClickFormInit : () => {
            if (!confirm("입력된 내용을 모두 초기화 하시겠습니까?")) {
                return;
            }
            ri_main.clearForm();
        }
    }
};

$(document).ready(() => {
    // 페이지를 떠날 때 발생하는 beforeunload 이벤트 처리
    $(window).on("beforeunload", () => {
        return "이 페이지를 떠나시겠습니까? 변경 내용이 저장되지 않을 수 있습니다.";
    });

    if ($.isEmptyObject(ri_rule)) {
        alert("입력 규칙 설정 후 사용 가능합니다.");
        $("#separatorBox, .input-box").attr("disabled", true);
        return;
    }    

    ri_main.initFormTableHead();
    ri_main.initFormTableBody();
    ri_main.initResultTable();
    ri_main.initCautionBox();

    ri_main.fixedForm();
});

$(window).resize(() => {
    ri_main.fixedForm();
});