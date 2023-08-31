const rm_main = {

    createRuleFile : rule => {    
        const jsonCode = "const ri_rule = " + JSON.stringify(rule, null, 2);
        const blob = new Blob([jsonCode], { type: "text/javascript" });
        saveAs(blob, "rule.js");
    },

    eventHandler : () => {
        
    }
};