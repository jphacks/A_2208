type ParseMode = "Default" | "NodeId" | "NodeTypeStart" | "NodeName" | "NodeTypeEnd" | "Arrow" | "ArrowName";

function ensureNotNull<T>(param: T | undefined): T {
    if (param === undefined) {
        throw new Error();
    }
    return param;
}

function getNodeType(nodeStart: string): string {
    // 仮
    return nodeStart.replace('\"', "");
}

class ParsingNode {

    public nodeId: string | undefined;
    public nodeStart: string | undefined;
    public nodeName: string | undefined;
    public nodeEnd: string | undefined;

    constructor() {
        this.nodeId = undefined;
        this.nodeStart = undefined;
        this.nodeName = undefined;
        this.nodeEnd = undefined;
    }

    isValid(): boolean {
        if (this.nodeId === undefined) {
            return false;
        }
        if (this.nodeStart === undefined) {
            if (this.nodeEnd !== undefined || this.nodeName !== undefined) {
                return false;
            }
            return true;
        }
        if (this.nodeName === undefined || this.nodeEnd === undefined) {
            return false;
        }
        // should check start-end matching here.
        return true;
    }
}

class ParsingEdge {
    public isQuoted: boolean;
    public arrowLength: number;
    public arrowNameSign: boolean;
    public arrowName: string | undefined;

    constructor() {
        this.isQuoted = false;
        this.arrowLength = 0;
        this.arrowNameSign = false;
        this.arrowName = undefined;
    }

    isValid(): boolean {
        if (this.arrowLength === 0) {
            return false;
        }
        return true;
    }
}

export class GraphHandler {
    public nodes: Node[];
    public edges: Edge[];

    private validStartChars = ["(", "{", "[", "\\", "/"];
    private validEndChars = [")", "}", "]", "\\", "/"];
    private validArrowChars = ["-"];
    private validArrowEnds = [">"];
    private validArrowNameChars = ["|"];
    private whiteSpaces = [" ", "\t"];

    public parse(input: string) {
        const _edges: Edge[] = [];
        const _nodes: Node[] = [];
        let parseMode: ParseMode = "Default";
        const lines = input.split("\n");

        function graphSyntaxError(i: number, j: number, msg: string) {
            const message = `構文解析エラー。\n${msg}\n行:${i + 1},列:${j + 1}`;
            console.error(message);
            return new Error(message);
        }

        for (let i = 0; i < lines.length; i++) {
            parseMode = "Default";
            const line = lines[i];


            if (line.includes("flowchart") || line.includes("click")) {
                continue;
            }

            let buffer: string[] = [];
            let parsingObjects: (ParsingNode | ParsingEdge)[] = [];

            let j = 0;

            let _nodeId: string | undefined;
            let _nodeStart: string | undefined;
            let _nodeName: string | undefined;
            let _nodeEnd: string | undefined;

            let _isQuoted = false;
            let _arrowLength = 0;
            let _arrowNameSigned = false;
            let _arrowName: string | undefined;

            function resetLocals() {
                _nodeId = undefined;
                _nodeStart = undefined;
                _nodeName = undefined;
                _nodeEnd = undefined;
                _isQuoted = false;
                _arrowLength = 0;
                _arrowNameSigned = false;
                _arrowName = undefined;
            }

            function genNode(): ParsingNode {
                let _node = new ParsingNode();
                _node.nodeId = _nodeId;
                _node.nodeStart = _nodeStart;
                _node.nodeName = _nodeName;
                _node.nodeEnd = _nodeEnd;
                if (!_node.isValid()) {
                    throw graphSyntaxError(i, j, "不完全なノード宣言です");
                }
                return _node;
            }

            function genEdge(): ParsingEdge {
                let _edge = new ParsingEdge();
                _edge.isQuoted = _isQuoted;
                _edge.arrowLength = _arrowLength;
                _edge.arrowNameSign = _arrowNameSigned;
                _edge.arrowName = _arrowName;
                if (!_edge.isValid()) {
                    throw graphSyntaxError(i, j, "不完全なエッジ宣言です");
                }
                return _edge;
            }

            for (; j < line.length; j++) {
                const val = lines[i][j];
                if (this.whiteSpaces.includes(val)) {
                    continue;
                }

                if (parseMode === "Default") {
                    buffer.push(val);
                    resetLocals();
                    parseMode = "NodeId";
                    continue;
                }

                if (parseMode === "NodeId") {
                    if (this.validStartChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "ノードIDがありません");
                        }
                        _nodeId = buffer.join("");
                        buffer = [];
                        buffer.push(val);
                        parseMode = "NodeTypeStart";
                        continue;
                    }
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "ノードIDがありません");
                        }
                        _nodeId = buffer.join("");
                        parsingObjects.push(genNode());
                        resetLocals();
                        buffer = [];
                        _arrowLength++;
                        parseMode = "Arrow"
                        continue;
                    }
                    buffer.push(val);
                    continue;
                }

                if (parseMode === "NodeTypeStart") {
                    if (this.validStartChars.includes(val)) {
                        buffer.push(val);
                        continue;
                    }
                    if (val === '"') {
                        _isQuoted = true;
                        buffer.push(val);
                        _nodeStart = buffer.join("");
                        buffer = [];
                        parseMode = "NodeName"
                        continue;
                    }
                    if (buffer.length !== 0) {
                        _nodeStart = buffer.join("");
                        buffer = [];
                    }
                    buffer.push(val);
                    parseMode = "Arrow";
                    continue;
                }

                if (parseMode === "NodeName") {
                    if (_isQuoted) {
                        if (val === '"') {
                            _nodeName = buffer.join("");
                            buffer = [];
                            buffer.push(val);
                            parseMode = "NodeTypeEnd";
                            continue;
                        } else {
                            buffer.push(val);
                            continue;
                        }
                    } else {
                        if (this.validEndChars.includes(val)) {
                            _nodeName = buffer.join("");
                            buffer = [];
                            buffer.push(val);
                            parseMode = "NodeTypeEnd";
                            continue;
                        } else {
                            buffer.push(val);
                            continue;
                        }
                    }
                }

                if (parseMode === "NodeTypeEnd") {
                    if (this.validEndChars.includes(val)) {
                        buffer.push(val);
                        continue;
                    } else {
                        _nodeEnd = buffer.join("");
                        parsingObjects.push(genNode());
                        resetLocals();
                        buffer = [];
                        _arrowLength++;
                        parseMode = "Arrow";
                        continue;
                    }
                }

                if (parseMode === "Arrow") {
                    if (this.validArrowChars.includes(val)) {
                        _arrowLength++;
                        continue;
                    }
                    if (this.validArrowNameChars.includes(val)) {
                        _arrowNameSigned = true;
                        parseMode = "ArrowName";
                        continue;
                    }
                    if (this.validArrowEnds.includes(val)) {
                        _arrowLength++;
                        parseMode = "NodeId";
                        parsingObjects.push(genEdge());
                        resetLocals();
                        buffer = [];
                        continue;
                    }
                    else {
                        buffer.push(val);
                        parseMode = "ArrowName";
                        continue;
                    }
                }

                if (parseMode === "ArrowName") {
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "矢印名がありません");
                        }
                        _arrowName = buffer.join("");
                        buffer = [];
                        _arrowLength++;
                        parseMode = "Arrow";
                        continue;
                    }
                    if (_arrowNameSigned && this.validArrowNameChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "矢印名がありません");
                        }
                        _arrowName = buffer.join("");
                        buffer = [];
                        _arrowLength++;
                        parseMode = "Arrow";
                        continue;
                    } else {
                        buffer.push(val);
                        continue;
                    }
                }
            }

            // flush buffer
            if (parseMode === "Default") {
                continue;
            }
            if (buffer.length !== 0) {
                const j = line.length;
                if (parseMode === "NodeId") {
                    _nodeId = buffer.join("");
                    parsingObjects.push(genNode());
                }
                else if (parseMode === "NodeTypeStart") {
                    throw graphSyntaxError(i, j, "ノード名が閉じられていません");
                } else if (parseMode === "NodeName") {
                    throw graphSyntaxError(i, j, "ノードが閉じられていません");
                }
                else if (parseMode === "NodeTypeEnd") {
                    _nodeEnd = buffer.join("");
                    parsingObjects.push(genNode());
                }
                else if (parseMode === "Arrow") {
                    throw graphSyntaxError(i, j, "終わりノードがありません");
                }
                else if (parseMode === "ArrowName") {
                    throw graphSyntaxError(i, j, "終わりノードがありません");
                }
            }

            // finalize
            for (let k = 0; k < parsingObjects.length; k++) {
                const obj = parsingObjects[k];
                if (obj instanceof ParsingNode) {
                    const exists = _nodes.filter(x => x.id === obj.nodeId);
                    if (exists.length > 0) {
                        if (exists.length > 1) {
                            throw new Error("内部エラー : ノードのIDが重複しています");
                        }
                        if (obj.nodeName === undefined) {
                            continue;
                        }
                        exists[0].content = ensureNotNull(obj.nodeName);
                        exists[0].type = getNodeType(ensureNotNull(obj.nodeStart));
                        continue;
                    }
                    const node = new Node();
                    if (obj.nodeName === undefined) {
                        node.id = ensureNotNull(obj.nodeId);

                    } else {
                        node.id = ensureNotNull(obj.nodeId);
                        node.content = ensureNotNull(obj.nodeName);
                        node.type = getNodeType(ensureNotNull(obj.nodeStart));
                    }

                    _nodes.push(node);
                    continue;
                }
            }
            for (let k = 0; k < parsingObjects.length; k++) {
                const obj = parsingObjects[k];
                if (obj instanceof ParsingEdge) {
                    if (k === 0 || k === parsingObjects.length - 1) {
                        throw new Error("内部エラー : 末端のエッジ宣言");
                    }
                    const from = parsingObjects[k - 1];
                    const to = parsingObjects[k + 1];
                    if (from instanceof ParsingNode) {
                        if (to instanceof ParsingNode) {
                            let froms = _nodes.filter(x => x.id === from.nodeId);
                            if (froms.length !== 1) {
                                throw new Error("内部エラー : ノードのIDが重複しています");
                            }
                            let tos = _nodes.filter(x => x.id === to.nodeId);
                            if (tos.length !== 1) {
                                throw new Error("内部エラー : ノードのIDが重複しています");
                            }
                            const _edge = new Edge();
                            _edge.fromNode = froms[0];
                            _edge.toNode = tos[0];
                            _edge.arrowLength = obj.arrowLength;
                            _edge.content = obj.arrowName;
                            _edges.push(_edge);
                            continue;
                        }
                    }
                    throw new Error("内部エラー : ノードに挟まれないエッジ");
                }
            }
        }

        for (let i = 0; i < _edges.length; i++) {
            const edge = _edges[i];
            edge.toNode.incommingEdges.push(edge);
            edge.fromNode.outgoingEdges.push(edge);
        }
        this.nodes = _nodes;
        this.edges = _edges;
        return;
    }

    public getNodeById(id: string) {
        const match = this.nodes.filter(x => x.id == id);
        if (match.length === 0) {
            throw new Error(`id ${id} をもつ要素が見つかりません`);
        }
        if (match.length > 1) {
            throw new Error("内部エラー : IDが重複しています");
        }
        return match[0];
    }

    private getEndType(nodeType: string): string {
        let result = "";
        for (let i = 0; i < nodeType.length; i++) {
            const index = this.validStartChars.indexOf(nodeType[i]);
            if (index === -1) {
                throw new Error("不正なノードです");
            }
            result += this.validEndChars[index];
        }
        return result;
    }

    public toMermaidString(): string {
        let result = "flowchart TB\n";

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (node.content === undefined) {
                result += node.id;
                result += "\n";
                continue;
            } else {
                result += node.id;
                result += node.type;
                result += '"';
                result += node.content;
                result += '"';
                result += this.getEndType(ensureNotNull(node.type).split("").reverse().join(""));
                result += "\n";
            }
        }
        for (let i = 0; i < this.edges.length; i++) {
            const edge = this.edges[i];
            if (edge.content === undefined) {
                result += edge.fromNode.id;
                result += " ";
                result += "-->";
                result += " ";
                result += edge.toNode.id;
                result += "\n";
            } else {
                result += edge.fromNode.id;
                result += " ";
                result += "--";
                result += edge.content;
                result += "-->";
                result += " ";
                result += edge.toNode.id;
                result += "\n";
            }
        }

        return result;
    }

    public toInternalMermaidString(): string {
        let result = this.toMermaidString();
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            result += "click";
            result += " ";
            result += node.id;
            result += " ";
            result += "call";
            result += " ";
            result += "__handle_click("
            result += '"';
            result += node.id;
            result += '"';
            result += ")"
            result += "\n";
        }
        return result;
    }

    public addNode(content: string | undefined, type: string | undefined): void {
        const node = new Node();
        node.id = this.getUniqueNodeId();
        console.debug(node.id);
        node.content = content;
        node.type = type;

        if (content !== undefined) {
            if (type === undefined) {
                throw new Error("内部エラー : contentを指定する場合、typeも指定してください");
            }
            for (let i = 0; i < type.length; i++) {
                if (!this.validStartChars.includes(type[i])) {
                    throw new Error("内部エラー : 無効なノードtypeです");
                }
            }
        }

        this.nodes.push(node);
    }

    private getUniqueNodeId(): string {
        const exists = this.nodes.map(x => x.id).filter(x => x !== "alpha");

        let maxLength = 0;
        for (let i = 0; i < exists.length; i++) {
            if (exists[i].length > maxLength) {
                maxLength = exists[i].length;
            }
        }

        const maxLengthNodes = exists.filter(x => x.length === maxLength).sort();
        var latest = maxLengthNodes[maxLengthNodes.length - 1];

        for (let i = latest.length - 1; i >= 0; i--) {
            const val = latest[i];
            if (val !== 'Z') {
                let charCode = val.charCodeAt(0);
                charCode++;
                let nextChar = String.fromCharCode(charCode);
                let result = "";
                for (let j = 0; j < latest.length; j++) {
                    if (i === j) {
                        result += nextChar;
                    } else if (j < i) {
                        result += latest[j];
                    } else {
                        result += "A";
                    }
                }
                return result;
            }
        }

        let result = "";
        for (let i = 0; i < latest.length + 1; i++) {
            result += "A";
        }
        return result;
    }

    public deleteNode(node: Node) {
        this.nodes = this.nodes.filter(x => x !== node);
    }

    public addEdge(arrowLength: number, content: string | undefined, fromNode: Node, toNode: Node) {
        const edge = new Edge();
        edge.arrowLength = arrowLength;
        edge.content = content;
        edge.fromNode = fromNode;
        edge.toNode = toNode;

        if (arrowLength <= 0) {
            throw new Error("矢印の長さが必要です");
        }

        this.edges.push(edge);
        fromNode.outgoingEdges.push(edge);
        toNode.incommingEdges.push(edge);
    }

    public deleteEdge(edge: Edge) {
        edge.fromNode.outgoingEdges = edge.fromNode.outgoingEdges.filter(x => x !== edge);
        edge.toNode.incommingEdges = edge.toNode.incommingEdges.filter(x => x !== edge);

        this.edges = this.edges.filter(x => x !== edge);
    }
}

export class Edge {
    arrowLength: number;
    content: string | undefined;

    fromNode: Node;
    toNode: Node;
}

export class Node {
    constructor() {
        this.incommingEdges = [];
        this.outgoingEdges = [];
    }

    id: string;
    content: string | undefined;
    type: string | undefined;

    incommingEdges: Edge[];
    outgoingEdges: Edge[];
}