function setDefaultString(inputString, defaultValue) {
    const str = String(inputString);
    if (inputString === undefined || inputString === null || str.trim() === '') {
        return defaultValue;
    }
    return str;
}

const rm_main = {

    replaceNewLineToHtml : (str) => {
        return String(str).replace(/\n/g, '<br>');
    },

    replaceHtmlToNewLine : (str) => {
        return String(str).replace(/<br\s*\/?>/g, '\n');
    },

    createInputRule : rule => {
        const $div = $("<div>").addClass("rule-line");

        const $delRule = $("<a>").addClass("button").attr("href", "#").text("규칙 삭제").click(function(e) {
            e.preventDefault();
            $(this).closest('.rule-line').remove();
        });
        $div.append($delRule);

        $div.append($("<input>", {
            type: 'number',
            value: setDefaultString(rule?.value, ""), 
            min: 0, 
            step: 1
        }));

        const $selTest = $("<select>");
        $selTest.append($("<option>").attr("value", "=").text("과(와) 같으면"));
        $selTest.append($("<option>").attr("value", "!").text("과(와) 다르면"));
        $selTest.append($("<option>").attr("value", ">").text("보다 크면"));
        $selTest.append($("<option>").attr("value", ">=").text("보다 크거나 같으면"));
        $selTest.append($("<option>").attr("value", "<").text("보다 작으면"));
        $selTest.append($("<option>").attr("value", ">=").text("보다 작거나 같으면"));
        $selTest.val(setDefaultString(rule?.test, "="));
        $div.append($selTest);
    
        $div.append($("<input>", {
            type: 'text',
            value: setDefaultString(rule?.dest, "")
        }));

        const $selEmpty = $("<select>");
        $selEmpty.append($("<option>").attr("value", "f").text("항목은 필수입력"));
        $selEmpty.append($("<option>").attr("value", "t").text("항목은 입력X"));
        $selEmpty.val(setDefaultString(rule?.empty, "f"));

        $div.append($selEmpty);

        return $div;
    },

    createTdColumnName : name => {
        const $input = $('<input type="text">').addClass("column-name");
        if (name) {
            $input.val(String(name));
        }
        return $("<td>").append($input);
    },

    createTdRule : rules => {
        const $addRule = $("<a>").addClass("button").attr("href", "#").text("규칙 추가").click(function(e) {
            e.preventDefault();
            $(this).closest('.cell-rule').append(rm_main.createInputRule());
        });
        
        const $td = $("<td>");
        const $div = $("<div>").addClass("cell-rule").append($addRule);        

        if (rules === undefined) {
            return $td.append($div);
        }

        for (let i = 0; i < rules.length; i++) {
            $div.append(rm_main.createInputRule(rules[i]));
        }

        return $td.append($div);
    },

    createTdMemo : (memo) => {
        const $textarea = $('<textarea>').addClass("column-memo");
        if (memo) {
            $textarea.val(rm_main.replaceHtmlToNewLine(memo));
        }
        return $("<td>").append($textarea);
    },

    getRules : ($row) => {
        const rules = [];

        $row.find(".rule-line").each(function() {
            let rule = {
                value : "",
                test : "",
                dest : "",
                empty : ""
            };
            
            const $this = $(this)
            rule.value = $this.find("input").eq(0).val().trim();
            rule.test = $this.find("select").eq(0).val();
            rule.dest = $this.find("input").eq(1).val().trim();
            rule.empty = $this.find("select").eq(1).val();

            if (rule.value.length > 0 && rule.dest.length > 0) {
                rules.push(rule);
            }
        });

        return rules;
    },

    getRow : ($row) => {
        // 파라메터는 JQuery TR
        const column = {}    
        column.name = $row.find(".column-name").val().trim();        

        rules = rm_main.getRules($row);
        if (rules.length > 0) {
            column.rules = rules;
        }

        const memo = $row.find(".column-memo").val().trim();
        if (memo.length > 0) {
            column.memo = memo;
        }
        return column;
    },

    createRow : (colName, rules, memo) => {
        const $newRow = $("<tr>");
        const $delRow = $("<a>").addClass("button").attr("href", "#").text("삭제").click(function(e) {
            e.preventDefault();            
            $(this).closest("tr").remove();
        });
        $newRow.append($("<td>").append($delRow));

        $newRow.append(rm_main.createTdColumnName(colName));
        $newRow.append(rm_main.createTdRule(rules));
        $newRow.append(rm_main.createTdMemo(memo));

        const $copyRow = $("<a>").addClass("button").attr("href", "#").text("복사").click(function(e) {
            e.preventDefault();
            const $currentRow = $(this).closest("tr");
            const column = rm_main.getRow($currentRow);
            const $copyRow = rm_main.createRow(column.name, column.rules, column.memo);
            $currentRow.after($copyRow);
        });
        $newRow.append($("<td>").append($copyRow));
        return $newRow;
    },

    appendRow : (colName, rules, memo) => {
        const newRow = rm_main.createRow(colName, rules, memo);

        // 생성된 행 추가
        const lastRow = $("#rule tbody tr:last");
        if (lastRow.length) {
            lastRow.after(newRow);
        } else {
            // 테이블에 행이 없는 경우, tbody 내부에 직접 추가합니다.
            $("#rule tbody").append(newRow);
        }
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

        const jsonCode = "const ri_rule = " + JSON.stringify(rule);
        const blob = new Blob([jsonCode], { type: "text/javascript" });
        saveAs(blob, "rule.js");
    },

    scrollToLastRow : () => {
        var $lastRow = $('#rule tbody tr:last');
        var lastRowOffset = $lastRow.offset().top;
        $('html, body').animate({ scrollTop: lastRowOffset }, 300);
    },

    scrollToTargetRow : (index) => {
        var $lastRow = $('#rule tbody tr').eq(index);
        var targetRowOffset  = $lastRow.offset().top;
        $('html, body').animate({ scrollTop: targetRowOffset }, 300);
    },

    eventHandler : {
        createRule : () => {
            if ($("#rule tbody tr").length == 0) {
                alert("생성할 항목이 없습니다.");
                return;
            }
    
            const rule = {
                "caution" : rm_main.replaceNewLineToHtml($("#caution").val()),
                "cols": []
            };

            $("#rule tbody tr").each(function() {
                const $row = $(this);
                
                // column name
                const column = {};

                const name = $row.find("td:eq(1) input").val().trim();
                const rules = rm_main.getRules($row.find("td:eq(2) .cell-rule"));
                const memo = rm_main.replaceNewLineToHtml($row.find("td:eq(3) textarea").val().trim());
                
                if (name.length == 0) {
                    return;
                }

                column.name = name;
                if (rules.length > 0) {
                    column.rules = rules;
                }
                if (memo.length > 0) {
                    column.memo = memo;
                }

                // rule
                rule.cols.push(column);
            });
    
            rm_main.createRuleFile(rule);
        },
    
        initRule : () => {
            if (!confirm("입력된 모든 내용이 초기화 됩니다.\n계속하시겠습니까?")) {
                return;
            }
    
            $("#caution").val("");
            $("#rule tbody").empty();
        },

        appendNewRow : () => {
            rm_main.appendRow();
            rm_main.scrollToLastRow();
        }
    }
};


$(document).ready(() => {
    // 페이지를 떠날 때 발생하는 beforeunload 이벤트 처리
    $(window).on("beforeunload", () => {
        return "이 페이지를 떠나시겠습니까? 변경 내용이 저장되지 않을 수 있습니다.";
    });

    $(".collapsible").click(() => {
        $(".content").slideToggle();
    });
    
    if ($.isEmptyObject(ri_rule)) {
        alert("입력 규칙 설정 후 사용 가능합니다.");
        $("#separatorBox, .input-box").attr("disabled", true);
        return;
    }

    if (!ri_rule) {
        return;
    }

    $("#caution").val(rm_main.replaceHtmlToNewLine(ri_rule.caution));
    for (let i = 0; i < ri_rule.cols.length; i++) {
        rm_main.appendRow(ri_rule.cols[i].name, ri_rule.cols[i].rules, ri_rule.cols[i].memo);
    }

});