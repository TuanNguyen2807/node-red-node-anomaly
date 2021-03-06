module.exports = function(RED) {

    var jsonata = require('jsonata');
    
    // function Compareeq(a, b) {
    //     return (a == b) ? true : false;
    // }
    const getDateFromTimeString = str => new Date(null, null, null, ...str.split(':').map(t => parseInt(t)))
    
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
    //     this.start = config.start;
    //     this.end = config.end;
    //     this.volume = config.volume;
    //     this.compare = config.compare;
    //     this.errorMsg = msg => {
    //         this.error(msg)
    //         this.status({ fill: 'red', shape: 'dot', text: msg })
    //         setTimeout(() => this.status({}), 10000)
    //       }
          
    // this.validateDates = function (startDate, endDate) {
    //     if (startDate >= endDate) {
    //       this.errorMsg('start time >= end time')
    //       return false
    //     }
    //     return true
    //   }
    //   if (!/^\d\d:\d\d:\d\d$/.test(this.start) || !/^\d\d:\d\d:\d\d$/.test(this.end)) {
    //     this.errorMsg('Malformed time')
    //     return false
    //   }
    //   this.startDate = getDateFromTimeString(this.start)
    //   this.endDate = getDateFromTimeString(this.end)
    //   this.validateDates(this.startDate, this.endDate)
    //     var node = this;

    //     // var timenow = new Date().getHours();
        
    //     node.on('input', function(msg) {
    //         if (!node.validateDates(node.startDate, node.endDate)) return
    //         const now = Date.now()
    //         const start = (new Date(now)).setHours(node.startDate.getHours(), node.startDate.getMinutes(), node.startDate.getSeconds(), 0)
    //         const end = (new Date(now)).setHours(node.endDate.getHours(), node.endDate.getMinutes(), node.endDate.getSeconds(), 0)
    //         var strType = "NULL"
    //         // if(typeof msg.payload !=="string"){
    //         //     console.log("QUANG STRING")
                
    //         // } else {
                
    //         // }
        
    //         var inputJson = JSON.parse(msg.payload)
    //             if(inputJson.length>0){
    //                 strType = inputJson[0].bn;
    //             }
    //             var volume
    //             if (typeof strType !== 'undefined' && strType!="NULL"){
    //                 var typeLog = strType.split("_")[2] + strType.split("_")[3]
    //                 if (typeLog==="ControlSetVolume"){
    //                     volume = inputJson[0].v
    //                     var mcuid = inputJson[1].vs
    //                     if (now >= start && now < end) {
    //                         switch (node.compare) {
    //                             // case "eq" :
    //                             //     if(Compareeq(vl, node.volume)) {
    //                             //         msg.payload = "";
    //                             //         node.send(msg);
    //                             //     } else {
    //                             //         node.warn("Not equal");
    //                             //     }
    //                             //     break;
    //                             case "gt":
    //                                 if(Comparegt(volume, node.volume)) {
    //                                     msg.payload = "Ph??t hi???n ??i???u khi???n ??m thanh loa "+mcuid+" qu?? ng?????ng trong kho???ng th???i gian: " + this.start +" - " + this.end;
    //                                     node.send(msg);
    //                                 } 
    //                                 else {
    //                                     node.warn("??m thanh ??i???u khi???n loa "+mcuid+" kh??ng v?????t qu?? ng?????ng");
    //                                 }
    //                                 break;
    //                             // case "gte":
    //                             //     if(Comparegte(vl, node.volume)) {
    //                             //         msg.payload = true;
    //                             //         node.send(msg);
    //                             //     } else {
    //                             //         node.warn("Not greater than or equal");
    //                             //     }
    //                             //     break;
    //                             // case "lt":
    //                             //     if(Comparelt(vl, node.volume)) {
    //                             //         msg.payload = true;
    //                             //         node.send(msg);
    //                             //     } else {
    //                             //         node.warn("Not less than");
    //                             //     }
    //                             //     break;
    //                             case "lte":
    //                                 if(Comparelte(volume, node.volume)) {
    //                                     msg.payload = "Ph??t hi???n ??i???u khi???n ??m thanh loa "+mcuid+" d?????i ng?????ng trong kho???ng th???i gian: " + this.start +" - " + this.end;
    //                                     node.send(msg);
    //                                 }
    //                                  else {
    //                                     node.warn("??m thanh ??i???u khi???n loa "+mcuid+" kh??ng d?????i ng?????ng");
    //                                 }
    //                                 break;
    //                         }
    //                     } else {
    //                         node.warn("Th???i gian hi???n t???i kh??ng n???m trong kho???ng "+ this.start +" - " + this.end);
    //                     }
    //                 }
    //             }
    //         // var vsString = msg.payload[0].vs;
    //         // var vs,tmp

        

    //     });
    // }

    function CheckNodeAnomalyByTime(config) {
        RED.nodes.createNode(this,config);
        this.start = config.start;
        this.end = config.end;
        this.chosenID = config.chosenID;
        this.chosenValue = config.chosenValue;
        this.threshold = config.threshold;
        this.compare = config.compare;
        this.errorMsg = msg => {
            this.error(msg)
            this.status({ fill: 'red', shape: 'dot', text: msg })
            setTimeout(() => this.status({}), 10000)
          }
          
        this.validateDates = function (startDate, endDate) {
            if (startDate >= endDate) {
                this.errorMsg('start time >= end time')
                return false
            }
                return true
        }
        if (!/^\d\d:\d\d:\d\d$/.test(this.start) || !/^\d\d:\d\d:\d\d$/.test(this.end)) {
            this.errorMsg('Malformed time')
            return false
        }
        this.startDate = getDateFromTimeString(this.start)
        this.endDate = getDateFromTimeString(this.end)
        this.validateDates(this.startDate, this.endDate)
        var node = this;

        // var timenow = new Date().getHours();
        
        node.on('input', async function(msg) {
            try {
                if (!node.validateDates(node.startDate, node.endDate)) return;
                const now = Date.now()
                const start = (new Date(now)).setHours(node.startDate.getHours(), node.startDate.getMinutes(), node.startDate.getSeconds(), 0)
                const end = (new Date(now)).setHours(node.endDate.getHours(), node.endDate.getMinutes(), node.endDate.getSeconds(), 0)

                let expResultID = await jsonata(node.chosenID).evaluate(msg.payload);
                let expResultValue = await jsonata(node.chosenValue).evaluate(msg.payload);

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
                    if (now >= start && now < end) {
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
                                if(Comparegt(expResultValue, Number(node.threshold))) {
                                    msg.payload = "Ph??t hi???n thi???t b??? " + expResultID + " qu?? ng?????ng trong kho???ng th???i gian: " + this.start +" - " + this.end;
                                    node.send(msg);
                                } 
                                else {
                                    node.warn("Thi???t b??? " + expResultID + " kh??ng v?????t qu?? ng?????ng");
                                }
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
                                if(Comparelte(expResultValue, Number(node.threshold))) {
                                    msg.payload = "Ph??t hi???n thi???t b??? " + expResultID + " d?????i ng?????ng trong kho???ng th???i gian: " + this.start +" - " + this.end;
                                    node.send(msg);
                                }
                                    else {
                                    node.warn("Thi???t b??? " + expResultID + " kh??ng d?????i ng?????ng");
                                }
                                break;
                        }
                    } else {
                        node.warn("Th???i gian hi???n t???i kh??ng n???m trong kho???ng "+ this.start +" - " + this.end);
                    }
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        });
    }
    RED.nodes.registerType("anomaly by time", CheckNodeAnomalyByTime);
}