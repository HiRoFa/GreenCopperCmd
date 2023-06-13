import {React, ReactDOM, ReactDOMServer} from './deps';

import * as htmlDom from 'greco://htmldom';


/*
let parser = new htmlDom.DOMParser();
let html = "<html><body><div id='mydiv'><i /></div></body></html>";
let document = parser.parseFromString(html);

globalThis.window = {
    document,
    HTMLIFrameElement: function(){}
};
globalThis.Element = greco.htmldom.Node;
globalThis.document = document;
globalThis.HTMLIFrameElement = function(){};
window.Element = greco.htmldom.Node;
*/

function Button(args: {hud: string, hid: string}){
    return <b className="MyButton" hid={args.hid} hud={args.hud}>Hello World!</b>;
}

function DangerButtons() {
    let id = new Date().getTime();
    return <i><Button color="red" hid={id} /><Button color="blue" hud={id} /></i>;
}

/*

const container = document.querySelector('#mydiv');


ReactDOM.hydrate(
  <DangerButtons />,
  container
);

console.log('html=\n%s', document.outerHTML);

*/

const ssrStr = ReactDOMServer.renderToString(<DangerButtons />);

console.log("ssr=\n%s", ssrStr);