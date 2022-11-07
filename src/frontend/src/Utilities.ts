// アプリケーションで使用する便利関数を管理します。

/**
* @param  content ダウンロードさせるデータ
* @param  filename ファイル名。省略可
* @param  mimetype データのMIME Type。省略可
* @see http://furudate.hatenablog.com/entry/2014/06/02/172923
*/
export function downloadData(
    content: ArrayBuffer | ArrayBufferView | Blob | string,
    filename: string | undefined,
    mimetype: string | undefined
) {
    if (arguments.length < 3) {
        mimetype = "application/octet-stream";
    }

    var url = (window.URL || window.webkitURL).createObjectURL(
        new Blob([content], { type: mimetype })
    );
    var a = document.createElement("a");

    a.target = "_blank";
    a.download = filename || "";
    a.href = url;

    a.click();
}