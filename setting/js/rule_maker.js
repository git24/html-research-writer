const rm_main = {

    createTdColumnName : name => {
        const $input = $('<input type="text">').addClass("column-name");
        if (name) {
            $input.val(name);
        }
        return $("<td>").append($input);
    },

    createTdRule : rules => {
        // TODO
        return $("<td>");
    },

    getRow : ($row) => {
        // 파라메터는 JQuery TR
        const column = {}    
        column.name = $row.find(".column-name").val();
        column.rules = [];
        return column;
    },

    createRow : (colName, rules) => {
        const $newRow = $("<tr>");
        const $delRow = $("<a>").addClass("button").attr("href", "#").text("삭제").click(function(e) {
            e.preventDefault();
            $(this).closest("tr").remove();
        });
        $newRow.append($("<td>").append($delRow));

        $newRow.append(rm_main.createTdColumnName(colName));
        $newRow.append(rm_main.createTdRule(rules));

        const $copyRow = $("<a>").addClass("button").attr("href", "#").text("복사").click(function(e) {
            const $currentRow = $(this).closest("tr");
            const column = rm_main.getRow($currentRow);
            const $copyRow = rm_main.createRow(column.name, column.rules);
            $currentRow.after($copyRow);
            rm_main.scrollToTargetRow($currentRow.index() + 1);
        });
        $newRow.append($("<td>").append($copyRow));
        return $newRow;
    },

    appendRow : (colName, rules) => {
        const newRow = rm_main.createRow(colName, rules);

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

        const jsonCode = "const ri_rule = " + JSON.stringify(rule, null, 2);
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
                "caution" : $("#caution").val().replace(/\n/g, '<br>'),
                "cols": []
            };
    
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
    
    if ($.isEmptyObject(ri_rule)) {
        alert("입력 규칙 설정 후 사용 가능합니다.");
        $("#separatorBox, .input-box").attr("disabled", true);
        return;
    }

    if (!ri_rule) {
        return;
    }

    $("#caution").val(ri_rule.caution.replace(/<br\s*\/?>/g, '\n'));
    for (let i = 0; i < ri_rule.cols.length; i++) {
        rm_main.appendRow(ri_rule.cols[i].name, ri_rule.cols[i].rules);
    }

});