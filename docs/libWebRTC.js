function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}

function getShortUuid(uuid) {
    return uuid.substring(9, 13);
}

class Log {
    constructor(tag) {
        this.enable = true;
        this.tag = tag;
    }
    onPrintOut(msg) {
        // var swap = document.createElement("swap");
        // swap.innerText = Date.now() + ":" + msg;
        // divthis.log.append(swap);
        // var br = document.createElement("br");
        // divthis.log.append(br);
    }
    genMsg(msg) {
        // console.trace(msg);
        if (Error.isPrototypeOf(msg.constructor)) {
            msg += "\n" + msg.stack;
        }
        msg = Date.now() + ":[" + this.tag + "] " + msg;
        this.onPrintOut(msg);
        return msg;
    }
    debug(msg) {
        // console.trace(msg);
        if (this.enable)
            console.debug(this.genMsg(msg));
    }
    log(msg) {
        if (this.enable)
            console.log(this.genMsg(msg));
    }
    warn(msg) {
        if (this.enable)
            console.warn(this.genMsg(msg));
    }
    error(msg) {
        if (this.enable)
            console.error(this.genMsg(msg));
    }
};
const DataChannelMsgType = {
    Broadcast: "Broadcast",
    JoinNetwork: "JoinNetwork",
    LinkUpdate: "LinkUpdate",
    SendOffer: "SendOffer",
    SendAnswer: "SendAnswer",
}
class DataChannelMsg {
    constructor(from, to, body, type, nodeID) {
        this.from = from;
        this.to = to;
        // if (body)
        //     this.body = body.substring(0, 20);
        this.body = body;
        this.genTime = Date.now();
        this.type = type;
        this.msgID = null;
        this.developed = false;
        this.msgID = generateUuid();
        this.nodeID = nodeID;
    }
    static parseJSON(jDCMsg) {
        var dcMsg = new DataChannelMsg();
        dcMsg.from = jDCMsg.from;
        dcMsg.to = jDCMsg.to;
        // dcMsg.body = jDCMsg.body.substring(0, 20);
        dcMsg.body = jDCMsg.body;
        dcMsg.genTime = jDCMsg.genTime;
        dcMsg.type = jDCMsg.type;
        dcMsg.msgID = jDCMsg.msgID;
        dcMsg.nodeID = jDCMsg.nodeID
        return dcMsg;
    }

    getMinMsgID() {
        return this.msgID.substring(9, 13);
    }

}
class Connect {
    constructor(offerID, isCreateOffer, onMessage, onConnectionStateChange, nodeID, answerID, requestNodeID) {
        this.log = new Log("Connect");
        this.log.enable = false;
        if (!requestNodeID) {
            this.log.error("No requestNodeID");
        }
        this.requestNodeID = requestNodeID;
        if (offerID != null && offerID.length != 0)
            this.offerID = offerID;//string
        if (answerID != null && answerID.length != 0)
            this.answerID = answerID;//string
        this.isCreateOffer = isCreateOffer;//bool
        this.constTimestamp = Date.now();
        this.connectID = generateUuid();
        this.chLable = "Ch_" + this.connectID + "_" + this.constTimestamp;
        this.peer = null;
        this.ch = null;
        this.nodeID = nodeID;
        this.onFinish_createOffer = null;
        this.onFinish_setOfferGenAnswer = null;
        this.onSetAnswer = null;
        this.onMessage = onMessage;
        this.onConnectionStateChange = onConnectionStateChange;
        this.dataChannelParams = { 
            ordered: false //訊息按照順序
        };
        this.candidate = [];
        this.rtcConfig = {
            iceServers: [
                // {
                //     urls: "stun:stun.services.mozilla.com",
                //     username: "louis@mozilla.com",
                //     credential: "webrtcdemo"
                // },
                {
                    urls: [
                        // "stun:stun.l.google.com:19302",
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                        // "stun:stun.webrtc.ecl.ntt.com:3478",
                    ]
                }
            ]
        };
        this.onOpenPlus=null;
    }
    setOnOpen(onOpenPlus){
        this.onOpenPlus=onOpenPlus;
    }
    close() {
        this.peer.close();
        this.peelOnConnectionStateChange();
    }
    getLinkStatus() {
        return this.offerID + "=>" + this.answerID;
    }
    getChLable() {
        return this.chLable.substring(0, 11);;
    }
    setOnMessage(onMessage) {
        this.onMessage = onMessage;
    }
    chOnOpen(event) {
        this.log.debug("DataChannel:onOpen" + this.ch);
        if (this.isCreateOffer) {
            var msg = "Offer " + this.offerID + " onOpen";
            var dcMsg = new DataChannelMsg(this.offerID, this.answerID, msg, DataChannelMsgType.JoinNetwork, this.nodeID);
        } else {
            var msg = "Anser " + this.answerID + " onOpen";
            var dcMsg = new DataChannelMsg(this.answerID, this.offerID, msg, DataChannelMsgType.JoinNetwork, this.nodeID);
        }
        this.ch.send(JSON.stringify(dcMsg));
        if(this.onOpenPlus){
            this.onOpenPlus(this);
        }
    }
    chOnMessage(event) {
        this.log.debug("DataChannel:onMessage " + event.data);
        this.onMessage(this, event);
    }
    chOnClose(event) {
        this.log.debug("DataChannel:chOnClose " + event.data);
    }
    chOnError(event) {
        this.log.debug("DataChannel:chOnError " + event.data);
    }
    peelOnConnectionStateChange(evt) {
        this.log.debug("peelOnConnectionStateChange evt=" + JSON.stringify(evt));
        this.onConnectionStateChange(this);
    }
    createOffer(onFinish_createOffer) {
        this.onFinish_createOffer = onFinish_createOffer;
        this.peer = new RTCPeerConnection(this.rtcConfig);
        this.peer.onconnectionstatechange = (evt) => { this.peelOnConnectionStateChange(evt); };
        // this.peer = new RTCPeerConnection();
        this.ch = this.peer.createDataChannel(this.chLable, this.dataChannelParams);
        this.ch.onopen = (evt) => { this.chOnOpen(evt); };
        // this.ch.addEventListener('open', () => {this.chOnOpen(evt);});
        this.ch.onmessage = (evt) => { this.chOnMessage(evt); };
        this.ch.onclose = (evt) => { this.chOnClose(evt); };
        this.ch.onerror = (evt) => { this.chOnError(evt); };
        // this.ch.addEventListener('message', () => {this.chOnMessage(evt);});
        this.peer.ondatachannel = (evt) => {
            this.log.debug("onDataChannel:" + this.ch.label);
        };
        // this.peer.addEventListener('datachannel', (evt) => {this.peer.ondatachannel(evt)});
        this.peer.onicecandidate = (evt) => {
            this.log.debug("Offer onIceCandidate" + this.constTimestamp);
            if (evt.candidate) { // ICE candidate が収集された場合
                this.log.debug("Offer Get ICE candidate:");
                this.candidate.push(evt.candidate);
                // this.candidate = evt.candidate;
            } else { // ICE candidateの収集が完了した場合
                this.log.debug("Offer end ICE candidate");
                //this.peer.localDescription 
                //JSON.stringify(this.peer.localDescription.toJSON())
                this.onFinish_createOffer(this, this.peer.localDescription);
            }
        }
        this.peer.createOffer().then((description) => {
            return this.peer.setLocalDescription(description);
        }).catch((reason) => {
            this.log.error("" + reason);
        });
    }
    setOfferGenAnswer(sdp, onFinish_setOfferGenAnswer, offerID, candidate, onAnswerDataChannel) {
        this.onFinish_setOfferGenAnswer = onFinish_setOfferGenAnswer;
        this.peer = new RTCPeerConnection(this.rtcConfig);
        this.peer.onconnectionstatechange = (evt) => { this.peelOnConnectionStateChange(evt); };
        this.onAnswerDataChannel = onAnswerDataChannel;
        // this.peer = new RTCPeerConnection();
        this.peer.ondatachannel = (evt) => {
            this.ch = event.channel;
            this.log.debug("Answer onDataChannel:" + this.ch.label);
            this.ch.onopen = (evt) => { this.chOnOpen(evt); }
            this.ch.onmessage = (evt) => { this.chOnMessage(evt); }
            this.ch.onclose = (evt) => { this.chOnClose(evt); };
            this.ch.onerror = (evt) => { this.chOnError(evt); };
            this.onAnswerDataChannel(this);
        }
        // this.peer.addEventListener('datachannel', (evt) => {this.peer.ondatachannel(evt)});
        this.peer.onicecandidate = (evt) => {
            this.log.debug("onIceCandidate" + this.constTimestamp);
            if (evt.candidate) { // ICE candidate が収集された場合
                this.log.debug("Answer Get ICE candidate:");
                this.candidate.push(evt.candidate);
                // this.candidate = evt.candidate;
            } else { // ICE candidateの収集が完了した場合
                this.log.debug("Answer end ICE candidate");
                //this.peer.localDescription 
                this.onFinish_setOfferGenAnswer(this, this.peer.localDescription.toJSON());
            }
        }
        this.offerID = offerID;
        this.peer.setRemoteDescription(sdp).then(() => {
            return this.peer.createAnswer();
        }).then((description) => {
            this.peer.setLocalDescription(description);
        }).catch((reason) => {
            this.log.error(reason);
        });
        candidate.forEach(candy => {
            this.peer.addIceCandidate(candy).then(() => {
                this.log.debug("setOfferGenAnswer addIceCandidate");
            }).catch((reason) => {
                this.log.error(reason);
            });
        });

    }
    setAnswer(sdp, onSetAnswer, answerID, candidate) {
        this.answerID = answerID;
        this.onSetAnswer = onSetAnswer;

        this.peer.setRemoteDescription(sdp).then(() => {
            this.log.debug("setAnswer setRemoteDescription");
        }).catch((reason) => {
            this.log.error(reason);
        });
        candidate.forEach(candy => {
            this.peer.addIceCandidate(candy).then(() => {
                this.log.debug("setAnswer addIceCandidate");
            }).catch((reason) => {
                this.log.error(reason);
            });
        });
    }
}