module.exports = function(RED) {

    var jsonata = require('jsonata');

    // function Compareeq(a, b) {
    //     return (a == b) ? true : false;
    // }
    function Comparegt(a, b) {
        return (a > b) ? true : false;
    }
    // function Comparegte(a, b) {
    //     return (a >= b) ? true : false;
    // }
    // function Comparelt(a, b) {
    //     return (a < b) ? true : false;
    // }
    function Comparelte(a, b) {
        return (a <= b) ? true : false;
    }

    // function CheckNode(config) {
    //     RED.nodes.createNode(this,config);
    //     this.temp = config.temp;
    //     this.compare = config.compare;

    //     var node = this;

    //     node.on('input', function(msg) {
    //         var inputJson = JSON.parse(msg.payload)
    //         var strType = "NULL"
    //         if(inputJson.length>0){
    //             strType = inputJson[0].bn
    //         }
    //         if (typeof strType !== 'undefined' && strType!="NULL"){
    //             var typeLog = strType.split("_")[2] + strType.split("_")[3]
    //             if (typeLog==="OPUSTATUS"){
    //                 var tmp =  inputJson[1].v
    //                 var mcu_id = inputJson[0].vs
    //                 switch (node.compare) {
    //                     // case "eq" :
    //                     //     if(Compareeq(vl, node.volume)) {
    //                     //         msg.payload = "";
    //                     //         node.send(msg);
    //                     //     } else {
    //                     //         node.warn("Not equal");
    //                     //     }
    //                     //     break;
    //                     case "gt":
    //                         if(Comparegt(tmp, node.temp)) {
    //                             msg.payload = "Loa "+mcu_id+" có nhiệt độ vượt ngưỡng cho phép!";
    //                             node.send(msg);
    //                         } 
    //                         // else {
    //                         //     node.warn("");
    //                         // }
    //                         break;
    //                     // case   "gte":
    //                     //     if(Comparegte(vl, node.volume)) {
    //                     //         msg.payload = true;
    //                     //         node.send(msg);
    //                     //     } else {
    //                     //         node.warn("Not greater than or equal");
    //                     //     }
    //                     //     break;
    //                     // case "lt":
    //                     //     if(Comparelt(vl, node.volume)) {
    //                     //         msg.payload = true;
    //                     //         node.send(msg);
    //                     //     } else {
    //                     //         node.warn("Not less than");
    //                     //     }
    //                     //     break;
    //                     case "lte":
    //                         if(Comparelte(tmp, node.temp)) {
    //                             msg.payload = "Loa "+mcu_id+" có nhiệt độ nhỏ hơn ngưỡng cho phép!";
    //                             node.send(msg);
    //                         } 
    //                         // else {
    //                         //     node.warn("Not less than or equal");
    //                         // }
    //                         break;
    //                 }
    //             }
    //         }
    //     });
    // }

    function CheckNodeAnomalyByValue(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name;
        this.threshold = config.threshold;
        this.compare = config.compare;
        this.chosenID = config.chosenID;
        this.chosenValue = config.chosenValue;

        var node = this;

        node.on('input', async function(msg) {
            try {
                if (node.chosenID === "" || 
                node.chosenValue === "") {
                    msg.payload = "ID and value must not blank.";
                    node.send(msg);
                    return;
                }

                let prefixData = "";

                if (JSON.stringify(msg.payload).startsWith('{')) {
                    prefixData = "$.";
                } else {
                    prefixData = "$";
                }

                let expResultID = await jsonata(prefixData + node.chosenID).evaluate(msg.payload);
                let expResultValue = await jsonata(prefixData + node.chosenValue).evaluate(msg.payload);

                if (typeof expResultID  === "object" || 
                    typeof expResultValue === "object") {
                    msg.payload = "ID or value must be a specific value.";
                    node.send(msg);
                    return;
                } else if (typeof expResultID  === "undefined" || 
                    typeof expResultValue === "undefined") {
                    msg.payload = "ID or value is undefined.";
                    node.send(msg);
                    return;
                } else if (isNaN(Number(expResultValue))) {
                    msg.payload = "Value muse be a number.";
                    node.send(msg);
                    return;
                } else {
                    switch (node.compare) {
                        // case "eq" :
                        //     if(Compareeq(vl, node.volume)) {
                        //         msg.payload = "";
                        //         node.send(msg);
                        //     } else {
                        //         node.warn("Not equal");
                        //     }
                        //     break;
                        case "gt":
                            if(Comparegt(Number(expResultValue), Number(node.threshold))) {
                                msg.payload = "Thiết bị " + expResultID + " có giá trị " + node.chosenID + " vượt ngưỡng cho phép!";
                                node.send(msg);
                            } 
                            // else {
                            //     node.warn("");
                            // }
                            break;
                        // case "gte":
                        //     if(Comparegte(vl, node.volume)) {
                        //         msg.payload = true;
                        //         node.send(msg);
                        //     } else {
                        //         node.warn("Not greater than or equal");
                        //     }
                        //     break;
                        // case "lt":
                        //     if(Comparelt(vl, node.volume)) {
                        //         msg.payload = true;
                        //         node.send(msg);
                        //     } else {
                        //         node.warn("Not less than");
                        //     }
                        //     break;
                        case "lte":
                            if(Comparelte(Number(expResultValue), Number(node.threshold))) {
                                msg.payload = "Thiết bị " + expResultID + " có giá trị " + node.chosenID + " nhỏ hơn ngưỡng cho phép!";
                                node.send(msg);
                            } 
                            // else {
                            //     node.warn("Not less than or equal");
                            // }
                            break;
                    }
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        });
    }
    RED.nodes.registerType("value", CheckNodeAnomalyByValue);
}