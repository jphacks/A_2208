type ParseMode = "Default" | "FromNodeId" | "FromNodeTypeStart" | "FromNodeName" | "FromNodeTypeEnd" | "Arrow" | "ArrowName"

export class GraphHandler {
    public nodes: Node[];
    public edges: Edge[];

    private validStartChars = ["(", "{"];
    private validEndChars = [")", "}"];
    private validArrowChars = ["-", ">"];
    private validArrowNameChars = ["|"];
    private whiteSpaces = [" "];

    private genSyntaxError(i: number, j: number, msg: string) {
        const message = `構文解析エラー。\n${msg}\n行:${i + 1},列:{j + 1}`;
        console.error(message);
        return new Error(message);
    }

    public parse(input: string) {
        const _edges: Edge[] = [];
        const _nodes: Node[] = [];
        let parseMode: ParseMode = "Default";
        const lines = input.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let buffer: string[] = [];
            let fromNodeId: string | undefined;
            let fromNodeStart: string | undefined;
            let fromNodeName: string | undefined;
            let fromNodeEnd: string | undefined;

            let isQuoted = false;
            let arrowLength = 0;
            let arrowNameSign = false;
            let arrowName: string;

            for (let j = 0; j < line.length; j++) {
                const val = lines[i][j];
                if (this.whiteSpaces.includes(val)) {
                    if (buffer.length === 0) {
                        continue;
                    }
                }

                if (parseMode === "Default") {
                    buffer.push(val);
                    parseMode = "FromNodeId";
                    continue;
                }

                if (parseMode === "FromNodeId") {
                    if (this.validStartChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw this.genSyntaxError(i, j, "ノードIDがありません");
                        }
                        fromNodeId = buffer.join();
                        buffer = [];
                        buffer.push(val);
                        parseMode = "FromNodeTypeStart";
                        continue;
                    }
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw this.genSyntaxError(i, j, "ノードIDがありません");
                        }
                        fromNodeId = buffer.join();
                        buffer = [];
                        buffer.push(val);
                        parseMode = "Arrow"
                        continue;
                    }
                    buffer.push(val);
                    continue;
                }

                if (parseMode === "FromNodeTypeStart") {
                    if (this.validStartChars.includes(val)) {
                        buffer.push(val);
                        continue;
                    }
                    if (val === '"') {
                        isQuoted = true;
                        buffer.push(val);
                        fromNodeStart = buffer.join();
                        buffer = [];
                        parseMode = "FromNodeName"
                        continue;
                    }
                    if (buffer.length !== 0) {
                        fromNodeStart = buffer.join();
                        buffer = [];
                    }
                    parseMode = "FromNodeName";
                    continue;
                }

                if (parseMode === "FromNodeName") {
                    if (isQuoted) {
                        if (val === '"') {
                            fromNodeName = buffer.join();
                            buffer = [];
                            buffer.push(val);
                            parseMode = "FromNodeTypeEnd";
                            continue;
                        } else {
                            buffer.push(val);
                            continue;
                        }
                    } else {
                        if (this.validEndChars.includes(val)) {
                            fromNodeName = buffer.join();
                            buffer = [];
                            buffer.push(val);
                            parseMode = "FromNodeTypeEnd";
                            continue;
                        } else {
                            buffer.push(val);
                            continue;
                        }
                    }
                }

                if (parseMode === "FromNodeTypeEnd") {
                    if (this.validEndChars.includes(val)) {
                        buffer.push(val);
                        continue;
                    } else {
                        fromNodeEnd = buffer.join();
                        buffer = [];
                        buffer.push(val);
                        parseMode = "Arrow";
                    }
                }

                if (parseMode === "Arrow") {
                    if (this.validArrowChars.includes(val)) {
                        arrowLength++;
                        continue;
                    }
                    if (this.validArrowNameChars.includes(val)) {
                        arrowNameSign = true;
                        parseMode = "ArrowName";
                        continue;
                    } else {
                        // 終わりノードへ
                    }
                }

                if (parseMode === "ArrowName") {
                    if (this.validArrowChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw this.genSyntaxError(i, j, "矢印名がありません");
                        }
                        arrowName = buffer.join();
                        buffer = [];
                        parseMode = "Arrow";
                        continue;
                    }
                    if (arrowNameSign && this.validArrowNameChars.includes(val)) {
                        if (buffer.length === 0) {
                            throw this.genSyntaxError(i, j, "矢印名がありません");
                        }
                        arrowName = buffer.join();
                        buffer = [];
                        parseMode = "Arrow";
                        continue;
                    } else {
                        buffer.push(val);
                        continue;
                    }
                }
            }

            if (parseMode === "Default") {
                continue;
            }
            if (buffer.length !== 0) {
                const j = line.length;
                if (parseMode === "FromNodeId") {
                    fromNodeId = buffer.join();
                }
                else if (parseMode === "FromNodeTypeStart") {
                    throw this.genSyntaxError(i, j, "ノード名が閉じられていません");
                } else if (parseMode === "FromNodeName") {
                    throw this.genSyntaxError(i, j, "ノードが閉じられていません");
                }
                else if (parseMode === "FromNodeTypeEnd") {
                    fromNodeEnd = buffer.join();
                }
                else if (parseMode === "Arrow") {
                    throw this.genSyntaxError(i, j, "終わりノードがありません");
                }
            }
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