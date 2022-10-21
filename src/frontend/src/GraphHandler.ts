type ParseMode = "Default" | "NodeId" | "NodeTypeStart" | "NodeName" | "NodeTypeEnd" | "Arrow" | "ArrowName";

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

    private validStartChars = ["(", "{"];
    private validEndChars = [")", "}"];
    private validArrowChars = ["-", ">"];
    private validArrowNameChars = ["|"];
    private whiteSpaces = [" "];

    public parse(input: string) {
        const _edges: Edge[] = [];
        const _nodes: Node[] = [];
        let parseMode: ParseMode = "Default";
        const lines = input.split("\n");

        function graphSyntaxError(i: number, j: number, msg: string) {
            const message = `構文解析エラー。\n${msg}\n行:${i + 1},列:{j + 1}`;
            console.error(message);
            return new Error(message);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let buffer: string[] = [];
            let parsingNodes: ParsingNode[] = [];
            let parsingEdges: ParsingEdge[] = [];
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
                    if (buffer.length === 0) {
                        continue;
                    }
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
                        _nodeId = buffer.join();
                        buffer = [];
                        buffer.push(val);
                        parseMode = "NodeTypeStart";
                        continue;
                    }
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "ノードIDがありません");
                        }
                        _nodeId = buffer.join();
                        parsingNodes.push(genNode());
                        resetLocals();
                        buffer = [];
                        buffer.push(val);
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
                        _nodeStart = buffer.join();
                        buffer = [];
                        parseMode = "NodeName"
                        continue;
                    }
                    if (buffer.length !== 0) {
                        _nodeStart = buffer.join();
                        buffer = [];
                    }
                    parseMode = "NodeName";
                    continue;
                }

                if (parseMode === "NodeName") {
                    if (_isQuoted) {
                        if (val === '"') {
                            _nodeName = buffer.join();
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
                            _nodeName = buffer.join();
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
                        _nodeEnd = buffer.join();
                        parsingNodes.push(genNode());
                        resetLocals();
                        buffer = [];
                        buffer.push(val);
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
                    } else {
                        parseMode = "NodeId";
                        parsingEdges.push(genEdge());
                        resetLocals();
                        continue;
                    }
                }

                if (parseMode === "ArrowName") {
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "矢印名がありません");
                        }
                        _arrowName = buffer.join();
                        buffer = [];
                        _arrowLength++;
                        parseMode = "Arrow";
                        continue;
                    }
                    if (_arrowNameSigned && this.validArrowNameChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw graphSyntaxError(i, j, "矢印名がありません");
                        }
                        _arrowName = buffer.join();
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
                    _nodeId = buffer.join();
                    parsingNodes.push(genNode());
                }
                else if (parseMode === "NodeTypeStart") {
                    throw graphSyntaxError(i, j, "ノード名が閉じられていません");
                } else if (parseMode === "NodeName") {
                    throw graphSyntaxError(i, j, "ノードが閉じられていません");
                }
                else if (parseMode === "NodeTypeEnd") {
                    _nodeEnd = buffer.join();
                    parsingNodes.push(genNode());
                }
                else if (parseMode === "Arrow") {
                    throw graphSyntaxError(i, j, "終わりノードがありません");
                }
                else if (parseMode === "ArrowName") {
                    throw graphSyntaxError(i, j, "終わりノードがありません");
                }
            }

            // finalize
        }
    }
}

export class Edge {
    fromNode: Node;
    toNode: Node;

    edgeType: any;
    edgeText: string;
}

export class Node {
    id: string;
    content: string;
}