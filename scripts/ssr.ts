import {React, ReactDOM, ReactDOMServer} from './deps';

import * as htmlDom from 'greco://htmldom';

let parser = new htmlDom.DOMParser();
let html = "<html><body><div id='mydiv'></div></body></html>";
let document = parser.parseFromString(html);

globalThis.window = {
    document
};
globalThis.Element = greco.htmldom.Node;
globalThis.document = document;
window.Element = greco.htmldom.Node;


function Button(args: {hud: string, hid: string}){
    return <input type="button">Hello World!</input>;
}

function DangerButton() {
    let id = new Date().getTime();
    return <i><Button color="red" hid={id} /><Button color="blue" hud={id} /></i>;
}

const container = document.querySelector('#mydiv');

/* todo this errors because

 no handler found for proxy_instance_set_prop: __reactContainer$8441027117998732
 so impl default catchall getter/setter and store props in instance obj somewhere

*/

ReactDOM.hydrate(
  <DangerButton />,
  container
);

console.log('html=\n%s', container.outerHTML);