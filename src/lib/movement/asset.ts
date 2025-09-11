const getSVGDOM = () => {
    return fetch('/hedgehog.svg')
        .then((resp) => resp.text())
        .then((text) => new DOMParser().parseFromString(text, 'image/svg+xml'));
};

const createSVGImage = (svgDoc: Document) => {
    const markup = new XMLSerializer().serializeToString(svgDoc.documentElement);
    const img = new Image();
    return new Promise<HTMLImageElement>((res, rej) => {
        img.onload = (e) => res(img);
        img.onerror = rej;
        img.src = 'data:image/svg+xml,' + encodeURIComponent(markup);
    });
};

export const prepareAsset = async ({ color }: { color: string }) => {
    const svgDoc = await getSVGDOM();
    svgDoc.documentElement.style.color = color;

    return createSVGImage(svgDoc);
};
