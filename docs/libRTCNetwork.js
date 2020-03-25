class LinkPaire {
    constructor(twoNodeID, byCh) {
        if (twoNodeID.length > 2) throw new Error("twoNodeID.length>2");
        this.twoNodeID = twoNodeID;
        this.byCh = [];
        if (byCh)
            this.byCh = byCh;
    }

    hasNode(NodeID) {
        return this.twoNodeID.filter(nid => nid == NodeID).length > 0;
    }
    hasChannel(channel) {
        return this.byCh.filter(ch => ch == channel).length > 0;
    }
    addCH(cannel) {
        this.byCh.push(cannel);
    }
}
class NetworkChannel {
    constructor(nodeID, poolConnect) {
        if (!nodeID) return;
        this.log = new Log("NetworkChannel");
        this.nodeID = nodeID;
        this.refresh(poolConnect);
    }
    refresh(poolConnect) {
        this.log.debug("NetworkChannel refresh");
        poolConnect = poolConnect.filter(c =>
            c.peer.connectionState !== "failed"
            && c.peer.connectionState !== "closed"
        );
        this.offerCHs = [];
        this.answerCHs = [];

        if (poolConnect) {
            poolConnect.forEach(Con => {
                if (Con.isCreateOffer) {
                    this.offerCHs.push(Con.ch.label);
                } else if (Con.ch) {
                    this.answerCHs.push(Con.ch.label);
                }
            });
        }
        return poolConnect;
    }
    static parseJSON(jNtCHannel) {
        var ntch = new NetworkChannel()
        ntch.nodeID = jNtCHannel.nodeID;;
        ntch.offerCHs = jNtCHannel.offerCHs;
        ntch.answerCHs = jNtCHannel.answerCHs;
        return ntch;
    }
    getAllChannels() {
        var channels = [];
        for (let i = 0; i < this.offerCHs.length; i++) {
            const ch = this.offerCHs[i];
            channels.push(ch);
        }
        for (let i = 0; i < this.answerCHs.length; i++) {
            const ch = this.answerCHs[i];
            channels.push(ch);
        }
        return channels;
    }
}

class RTCNetwork {
    constructor(userID, onMessagePlus) {
        this.limitLinkNum = 2;
        this.log = new Log("RTCNetwork");
        this.userID = userID;
        this.nodeID = generateUuid();
        this.poolConnect = [];
        this.poolReceiveMsg = [];
        this.poolNetworkChannel = [];
        this.allLinkPaire = [];
        this.selfNtChannel = new NetworkChannel(this.nodeID, this.poolConnect);
        this.poolNetworkChannel.push(this.selfNtChannel);
        this.onMessagePlus = onMessagePlus;
        this.onLinkUpdatePlus = null;
    }
    setOnLinkUpdate(onLinkUpdatePlus) {
        this.onLinkUpdatePlus = onLinkUpdatePlus;
    }
    createOffer(requestNodeID, onFinish, remoteNodeID) {
        var hasConnecting = false;
        var pc = null;
        for (let i = 0; i < this.poolConnect.length; i++) {
            const connect = this.poolConnect[i];
            var ch = connect.ch;
            if (connect.isCreateOffer == true && connect.requestNodeID == requestNodeID && (ch.readyState === "connecting")) {
                hasConnecting = true;
                pc = connect;
                break;
            }
        }
        if (hasConnecting) {
            // pc.createOffer(onFinish);
            this.log.warn("createOffer hasConnecting");
        } else {
            pc = new Connect(this.userID, true, (connect, evt) => { this.onMessage(connect, evt) },
                (connect) => { this.onConnectionStateChange(connect) }, this.nodeID, remoteNodeID, requestNodeID);
            pc.setOnOpen((connect) => { this.onOpen(connect) });
            pc.log.onPrintOut = this.log.onPrintOut;
            this.poolConnect.push(pc);
            pc.createOffer(onFinish);
        }
    }
    setOfferGenAnswer(jSdp, requestNodeID, onFinish) {
        var hasConnecting = false;
        var pc = null;
        for (let i = 0; i < this.poolConnect.length; i++) {
            const connect = this.poolConnect[i];
            var channel = connect.ch;
            if (!channel) {
                this.log.warn("setOfferGenAnswer Null Channel");
            } else if (connect.isCreateOffer == false && connect.requestNodeID == requestNodeID && (channel.readyState === "connecting")) {
                hasConnecting = true;
                pc = connect;
                break;
            }
        }
        var sdp = new RTCSessionDescription(jSdp);
        var candidate = [];
        for (let i = 0; i < jSdp.candidate.length; i++) {
            const candy = jSdp.candidate[i];
            candidate.push(new RTCIceCandidate(candy));
        }
        if (hasConnecting) {
            this.log.warn("setOfferGenAnswer hasConnecting");
            // pc.setOfferGenAnswer(sdp, onFinish, jSdp.offerID, candidate, onAnswerDataChannel);
        } else {
            pc = new Connect(null, false, (connect, evt) => { this.onMessage(connect, evt) }, (connect) => { this.onConnectionStateChange(connect) }, this.nodeID, this.userID, requestNodeID);
            pc.log.onPrintOut = this.log.onPrintOut;
            this.poolConnect.push(pc);
            pc.setOfferGenAnswer(sdp, onFinish, jSdp.offerID, candidate, (connect) => { this.onAnswerDataChannel(connect) });
        }
    }
    onAnswerDataChannel(connect) {
        this.log.warn("onAnswerDataChannel ChLable=" + connect.getChLable());
        this.onConnectionStateChange(connect);
    }
    setAnswer(jSdp, requestNodeID) {
        var hasConnecting = false;
        var pc = null;
        for (let i = 0; i < this.poolConnect.length; i++) {
            const element = this.poolConnect[i];
            var ch = element.ch;
            if (ch.readyState === "connecting" && element.isCreateOffer == true && element.requestNodeID == requestNodeID) {
                hasConnecting = true;
                pc = element;
                break;
            }
        }
        if (hasConnecting) {
            var sdp = new RTCSessionDescription(jSdp);
            var candidate = [];
            for (let i = 0; i < jSdp.candidate.length; i++) {
                const candy = jSdp.candidate[i];
                candidate.push(new RTCIceCandidate(candy));
            }
            try {
                pc.setAnswer(sdp, null, jSdp.answerID, candidate);
                return true;
            } catch (error) {
                this.log.error(error);
            }
        } else {
            this.log.warn("setAnswer Not hasConnecting");
        }
        return false;
    }

    onConnectionStateChange(connect) {
        this.log.debug("onConnectionStateChange ChLable=" + connect.getChLable() + ", LinkStatus=" + connect.getLinkStatus() + ", connectionState=" + connect.peer.connectionState);
        const before = this.poolConnect;
        this.poolConnect = this.selfNtChannel.refresh(before);
        if (this.poolConnect.length != before.length) {
            this.log.debug("poolConnect is different");
            this.developLinkUpdate();
        }
    }

    onOpen(connect) {
        this.log.debug("onOpen ChLable=" + connect.getChLable() + ", LinkStatus=" + connect.getLinkStatus() + ", readyState=" + connect.ch.readyState);
        // this.developLinkUpdate();
    }


    developLinkUpdate() {
        var linkMsg = JSON.stringify(this.selfNtChannel);
        var ntMsg = new DataChannelMsg(this.userID, null, linkMsg, DataChannelMsgType.LinkUpdate, this.nodeID);
        this.poolReceiveMsg.push(ntMsg);
        this.developMsg(ntMsg);//他方轉傳
    }


    onMessage(connect, evt) {
        const jDCMsg = JSON.parse(evt.data);
        var dcMsg = DataChannelMsg.parseJSON(jDCMsg);
        dcMsg.channel = connect.ch;
        this.log.debug("onMessage MinMsgID=" + dcMsg.getMinMsgID() + ", ChLable=" + connect.getChLable()
            + ", evt=" + JSON.stringify(evt)
            // + ", evt.data=" + evt.data
        );
        var sameMsg = null;
        for (let i = 0; i < this.poolReceiveMsg.length; i++) {
            const rDCMsg = this.poolReceiveMsg[i];
            if (rDCMsg.msgID === dcMsg.msgID) {
                sameMsg = rDCMsg;
                break;
            }
        }
        if (!sameMsg) {
            this.poolReceiveMsg.push(dcMsg);
        } else {
            this.log.debug("(" + dcMsg.getMinMsgID() + ")" + "hasSameMsg");
        }
        const now = Date.now();
        var diffTime = now - dcMsg.genTime;
        var limitTime = 10 * 1000;
        diffTime = 0;
        if (diffTime < limitTime && (!sameMsg)) {

            this.processMsg(dcMsg, connect);
        } else {
            this.log.debug("(" + dcMsg.getMinMsgID() + ")" + "developed");
        }
    }

    developMsg(dcMsg) {
        dcMsg.developed = true;
        for (let i = 0; i < this.poolConnect.length; i++) {
            const connect = this.poolConnect[i];
            const channel = connect.ch;
            if (!channel) {
                this.log.warn("developMsg Null Channel");
            } else if (channel.readyState != "open") {
                this.log.debug("developMsg ChLable=" + connect.getChLable() + ", channel.readyState=" + channel.readyState);
            } else if (dcMsg.channel != channel) {
                this.log.debug("developMsg ChLable:" + connect.getChLable() + "{Send}" + "(" + dcMsg.getMinMsgID() + ")");
                try {
                    channel.send(JSON.stringify(dcMsg));
                } catch (reason) {
                    this.log.error(reason)
                }
            } else {
                this.log.debug("developMsg (" + dcMsg.getMinMsgID() + ") Same Channel ChLable:" + connect.getChLable());
            }

        }
    }

    processMsg(dcMsg, connect) {
        if (dcMsg.type === DataChannelMsgType.Broadcast) {
            dcMsg.to = "EveryOne";
            this.onMessagePlus(dcMsg);
        } else if (dcMsg.type === DataChannelMsgType.JoinNetwork) {
            this.onMessagePlus(dcMsg);
            this.developLinkUpdate();
        } else if (dcMsg.type === DataChannelMsgType.LinkUpdate) {
            this.log.debug("LinkUpdate (" + dcMsg.getMinMsgID() + ") " + connect.getChLable());
            var netCH = NetworkChannel.parseJSON(JSON.parse(dcMsg.body));
            var hasCh = false;
            for (let i = 0; i < this.poolNetworkChannel.length; i++) {
                const ntCh = this.poolNetworkChannel[i];
                if (ntCh.nodeID === netCH.nodeID) {
                    this.poolNetworkChannel[i] = netCH;
                    hasCh = true;
                    break;
                }
            }
            if (!hasCh) {
                this.poolNetworkChannel.push(netCH);
            }

            this.onLinkUpdate();
        } else if (dcMsg.type === DataChannelMsgType.SendOffer) {
            if (dcMsg.to == this.nodeID) {
                this.log.log(dcMsg.from + " SendOffer to me");
                const jSdp = JSON.parse(dcMsg.body);
                const fromNodeID = dcMsg.from;
                this.setOfferGenAnswer(jSdp, fromNodeID, (connect, sdp) => {
                    var jSdp = connect.peer.localDescription.toJSON();
                    jSdp.answerID = connect.answerID;
                    jSdp.candidate = connect.candidate;
                    var txtSdp = JSON.stringify(jSdp);
                    var ntMsg = new DataChannelMsg(this.nodeID, fromNodeID, txtSdp, DataChannelMsgType.SendAnswer, this.nodeID);
                    this.poolReceiveMsg.push(ntMsg);
                    this.developMsg(ntMsg);//他方轉傳
                });
                return;
            } else {
                this.log.debug(dcMsg.from + " SendOffer  to " + dcMsg.to);
            }
        } else if (dcMsg.type === DataChannelMsgType.SendAnswer) {
            if (dcMsg.to == this.nodeID) {
                this.log.log(dcMsg.from + " SendAnswer to me");
                const jSdp = JSON.parse(dcMsg.body);
                const fromNodeID = dcMsg.from;
                var result = this.setAnswer(jSdp, fromNodeID);
                if (!result) {
                    this.log.warn("DataChannelMsgType.SendAnswer setAnswer Fail");
                } else {
                    this.log.warn("DataChannelMsgType.SendAnswer setAnswer Succ");
                }
                return;
            } else {
                this.log.debug(dcMsg.from + " SendAnswer  to " + dcMsg.to);
            }
        }
        this.developMsg(dcMsg);
    }

    getAllLinkPaire() {
        for (let i = 0; i < this.poolNetworkChannel.length; i++) {
            const nowNtCh = this.poolNetworkChannel[i];
            const nowAllCh = nowNtCh.getAllChannels();
            const otherNodes = this.poolNetworkChannel.filter(ntCh => ntCh != nowNtCh);
            for (let j = 0; j < otherNodes.length; j++) {
                var otherNode = otherNodes[j];
                const otherAllCh = otherNode.getAllChannels();
                var linkPaires = this.allLinkPaire.filter(link => link.hasNode(nowNtCh.nodeID) && link.hasNode(otherNode.nodeID));
                var linkPaire = null;
                if (linkPaires.length == 0) {
                    linkPaire = new LinkPaire([nowNtCh.nodeID, otherNode.nodeID]);
                    this.allLinkPaire.push(linkPaire);
                } else if (linkPaires.length == 1) {
                    linkPaire = linkPaires[0];
                } else
                    throw new Error("linkPaires.length>1");

                for (let x = 0; x < nowAllCh.length; x++) {
                    const nowCh = nowAllCh[x];
                    const index = otherAllCh.indexOf(nowCh);
                    if (index != -1 && !linkPaire.hasChannel(nowCh)) {
                        linkPaire.addCH(nowCh);
                    }
                }
            }
        }
    }

    onLinkUpdate() {
        this.getAllLinkPaire();
        if (this.onLinkUpdatePlus) this.onLinkUpdatePlus();
        //檢查Double Link 如果有先斷線 等下次onLinkUpdate
        
        //檢查最大連接數 是否可以連
        const nowLinkNum = this.selfNtChannel.getAllChannels().legth;
        if (this.poolNetworkChannel.length > 2 && nowLinkNum >= this.limitLinkNum) return;
        //選出一個
        this.noLinkNtCHs = this.poolNetworkChannel.filter(ntCh => !this.isLinkChannel(this.selfNtChannel, ntCh));
        if (this.noLinkNtCHs.length == 0) return;
        //可以連線的話 發出Offer
        var noLinkNtCH = this.noLinkNtCHs[0];
        this.createOffer(noLinkNtCH.nodeID, (connect, sdp) => {
            var jSdp = connect.peer.localDescription.toJSON();
            jSdp.offerID = connect.offerID;
            jSdp.candidate = connect.candidate;
            const txtSdp = JSON.stringify(jSdp);
            var ntMsg = new DataChannelMsg(this.nodeID, noLinkNtCH.nodeID, txtSdp, DataChannelMsgType.SendOffer, this.nodeID);
            this.poolReceiveMsg.push(ntMsg);
            this.developMsg(ntMsg);//他方轉傳
        });
    }

    isLinkChannel(selfNtChannel, otherNtCH) {
        if (selfNtChannel.nodeID == otherNtCH.nodeID) {
            return true;
        }
        const selfOfferIDs = selfNtChannel.offerCHs;
        const selfAnswerIDs = selfNtChannel.answerCHs;
        const otherOfferIDs = otherNtCH.offerCHs;
        const otherAnswerIDs = otherNtCH.answerCHs;
        for (let i = 0; i < otherOfferIDs.length; i++) {
            const otherOfferID = otherOfferIDs[i];
            const linkedIDs = selfAnswerIDs.filter(selfAnswerID => selfAnswerID == otherOfferID);
            if (linkedIDs.length > 0) {
                return true;
            }
        }
        for (let i = 0; i < otherAnswerIDs.length; i++) {
            const otherAnswerID = otherAnswerIDs[i];
            const linkedIDs = selfOfferIDs.filter(selfOfferID => selfOfferID == otherAnswerID);
            if (linkedIDs.length > 0) {
                return true;
            }
        }
        return false;
    }

}
