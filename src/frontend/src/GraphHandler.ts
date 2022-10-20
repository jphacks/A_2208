export class GraphHandler {
    public nodes: Node[];
    public edges: Edge[];

    private validStartChars = ["(", "{"];
    private validEndChars = [")", "}"];
    private whiteSpaces = [" "];

    private genSyntaxError(i: number, j: number, msg: string) {
        const message = `構文解析エラー。\n${msg}\n行:${i + 1},列:{j + 1}`;
        console.error(message);
        return new Error(message);
    }

    public parse(input: string) {
        const _edges: Edge[] = [];
        const _nodes: Node[] = [];

        const lines = input.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            let currentEdgeId;

            let contentStartIndex = -1;
            let anyContentCharsRead = false;

            let dqStartIndex = -1;
            let dqEndIndex = -1;

            for (let j = 0; j < line.length; j++) {
                const val = lines[i][j];
                if (this.whiteSpaces.includes(val)) {
                    continue;
                }

                if (contentStartIndex !== -1) {
                    if (dqStartIndex !== -1) {
                        if (val === '"') {
                            dqEndIndex = j;
                            continue;
                        } else {
                            continue;
                        }
                    } else {
                        if (val === '"') {
                            if (anyContentCharsRead) {
                                throw this.genSyntaxError(i, j, "ダブルクォーテーションの前に文字があります");
                            } else {
                                dqStartIndex = j;
                                continue;
                            }
                        }
                        if (this.validEndChars.includes(val)) {
                            if (currentEdgeId === undefined) {
                                throw this.genSyntaxError
                            }
                        }
                    }
                }

                if (this.validStartChars.includes(line[j])) {
                    if (contentStartIndex != -1) {
                        throw this.genSyntaxError(i, j, "括弧開始が冗長です");
                    }
                    contentStartIndex = j;
                    continue;
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