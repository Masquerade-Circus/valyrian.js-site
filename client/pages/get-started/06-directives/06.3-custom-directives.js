let dayjs = require("dayjs");
let Layout = require("../layout");
let Section = require("../../../components/Section");

let formatDate = (value) => dayjs(value).format("MMMM D, YYYY");

let CustomDirectives = {
  simple: () => {
    v.directive("test", (value) => console.log(`Hello ${value}`));
    return <div v-test="world" />;
  },

  vnode: () => {
    v.directive("test2", (value, vnode, oldVnode) => console.log(vnode, oldVnode));
    return <div v-test2>Hello</div>;
  },

  vnodeUpdated: false,

  identifyFirstRender: () => {
    v.directive("identify-first-render", (value, vnode, oldVnode) => {
      if (!oldVnode) {
        vnode.children = "First render, vnode created";
      } else {
        vnode.children = "Second render, vnode updated";
      }
    });

    return <div v-identify-first-render />;
  },

  modifyChildren() {
    v.directive("modify-children", (value, vnode) => (vnode.children = "Hello world"));

    return <div v-modify-children>Hello John Doe</div>;
  },

  modifyProperties() {
    // This will update the property by place, the change is not guaranteed.
    v.directive("modify-property", (value, vnode) => (vnode.props.class = "bg-success"));

    // This will update of the property by method, place is not important and the change is guaranteed.
    v.directive("modify-property-by-method", (value, vnode) => {
      vnode.props.class = "bg-success";
      v.updateProperty("class", vnode);
    });

    return [
      <button class="bg-primary" v-modify-property>
        class property before directive
      </button>,
      <br />,
      <button v-modify-property class="bg-primary">
        class property after directive
      </button>,
      <br />,
      <button class="bg-primary" v-modify-property-by-method>
        class before directive and updated by method
      </button>
    ];
  },

  addingEvents() {
    return (
      <button class="border-primary" onclick={(event, dom) => (dom.innerText = `Event ${event.type} fired`)}>
        Simple button
      </button>
    );
  },

  addingEventsToVnode() {
    v.directive("click", (value, vnode) => {
      vnode.props.onclick = (event, dom) => (dom.innerText = `Event ${event.type} fired`);
      v.updateProperty("onclick", vnode);
    });
    return (
      <button class="border-primary" v-click>
        Simple button
      </button>
    );
  },

  addingEventsToOtherDom() {
    v.directive("listen-to-scroll", (value, vnode) => {
      if (!v.isNode) {
        // Get the article element
        let article = document.getElementsByTagName("article")[0];

        // Set the listener to a var
        let listener = (e) => (vnode.dom.innerText = article.scrollTop);

        // Attach the listener
        article.addEventListener("scroll", listener);

        // If we re-render the ui remove the listener before attach it again
        v.onCleanup(() => article.removeEventListener("scroll", listener));
      }
    });

    return <span v-listen-to-scroll />;
  },

  flagImplementation() {
    v.directive("date-inline", (date, vnode) => (vnode.children = formatDate(date)));
    v.directive("date", (value, vnode) => (vnode.children = formatDate(vnode.children[0])));

    return [<div v-date-inline="08-16-2018" />, <div v-date>08-16-2018</div>];
  },

  complexExample() {
    v.directive("switch", (value, vnode) => {
      for (let i = 0, l = vnode.children.length; i < l; i++) {
        let [test, handler] = vnode.children[i];
        let result = typeof test === "function" ? test(value) : value === test;

        if (result) {
          vnode.children = typeof handler === "function" ? handler(value) : handler;
          return;
        }
      }

      vnode.children = value;
    });

    return ({ name }) => (
      <div v-switch={name}>
        {["John", <span>Hello John</span>]}
        {[(val) => val === "John Doe", <span>Hello John Doe</span>]}
        {["Jane", (val) => <span>Hello {val} Doe</span>]}
      </div>
    );
  },

  view() {
    let ComplexExample = CustomDirectives.complexExample();
    return (
      <Layout title="Custom directives">
        <Section title="Custom directives">
          Valyrian.js directives can be created calling the method <code>v.directive</code> passing the name of the directive as first parameter and a custom method as the second parameter.
        </Section>

        <Section title="Simple directive">
          The custom method will get the directive value as first parameter.
          {code(`
v.directive('test', (value) => console.log(\`Hello \${value}\`));
v.mount('body', () => <div v-test="world"></div>);
      `)}
          <samp>
            {CustomDirectives.simple()}
            {code(`
$ Hello world
          `)}
          </samp>
        </Section>

        <Section title="Getting vnodes">
          The custom method will get the new/updated vnode as the second parameter and the old vnode as the third.
          {code(`
v.directive('test2', (v, vnode, oldVnode) => console.log(vnode, oldVnode));
v.mount('body', () => <div v-test2>Hello</div>)
        `)}
          <samp>
            {CustomDirectives.vnode()}
            <div v-unless={CustomDirectives.vnodeUpdated}>
              {code(`
$ {
  props: { 'v-test2': true },
  children: [ 'Hello' ],
  name: 'div',
  isSVG: false,
  dom: Element {...}
} undefined
          `)}
            </div>
            <div v-if={CustomDirectives.vnodeUpdated}>
              {code(`
$ {
  props: { 'v-test2': true },
  children: [ 'Hello' ],
  name: 'div',
  isSVG: false,
  dom: Element {...}
} {
  props: { 'v-test2': true },
  children: [ 'Hello' ],
  name: 'div',
  isSVG: false,
  dom: Element {...}
}
          `)}
            </div>

            <button
              class="border-primary"
              onclick={() => {
                CustomDirectives.vnodeUpdated = true;
              }}
            >
              Update
            </button>
          </samp>
        </Section>

        <Section title="Identify created or updated node">
          We can identify if it is the first render by testing the presence of the third parameter (the old vnode). If there is no old vnode, then we can be confident that this is the first render.
          {code(`
v.directive('identify-first-render', (v, vnode, oldVnode) => {
  if (!oldVnode) {
    vnode.children = 'First render, vnode created';
  } else {
    vnode.children = 'Second render, vnode updated';
  }
});

v.mount('body', () => <div v-identify-first-render></div>);
          `)}
          <samp>
            {CustomDirectives.identifyFirstRender()}
            <button class="border-primary" onclick={() => {}}>
              Update
            </button>
          </samp>
        </Section>

        <Section title="Modifying children of vnodes">
          As in the previous sample, you can update or overwrite the children of this node modifying the <code>children</code> attribute of the vnode.
          {code(`
v.directive('modify-children', (v, vnode) => vnode.children = 'Hello world');

v.mount('body', () => <div v-modify-children>Hello John Doe</div>);
          `)}
          <samp>{CustomDirectives.modifyChildren()}</samp>
        </Section>

        <Section title="Modify properties of vnodes">
          Modify properties is not guaranteed because the properties are processed by place.
          <br />
          If the directive needs to update previous properties you need to update the property using the v.updateProperty method.
          {code(`
// This will update the property by place, the change is not guaranteed.
v.directive('modify-property', (value, vnode) => vnode.props.class = 'bg-success');

// This will update of the property by method, place is not important and the change is guaranteed.
v.directive('modify-property-by-method', (value, vnode) => {
  vnode.props.class = 'bg-success';
  v.updateProperty('class', vnode);
});

v.mount('body', () => [
  <button class="bg-primary" v-modify-property>class property before directive</button>,
  <br />,
  <button v-modify-property class="bg-primary">class property after directive</button>,
  <br />,
  <button class="bg-primary" v-modify-property-by-method>class before directive and updated by method</button>
]);
          `)}
          <samp>{CustomDirectives.modifyProperties()}</samp>
        </Section>

        <Section title="Adding events">
          <h4>Adding events to dom</h4>
          To add an event to the dom you can simply add the <code>{`on$\{eventName\}`}</code> attribute to the vnode you want to use it.
          {code(`
v.mount('body', () => <button class="border-primary" onclick={(event, dom) => dom.innerText = \`Event $\{event.type} fired\`}>Simple button</button>);
          `)}
          <samp>{CustomDirectives.addingEvents()}</samp>
          <small class="bg-warning-lightest">
            Each fired event will trigger an update of the app. To prevent this behavior you need to cancel the event with <code>event.preventDefault()</code>.
          </small>
          <hr />
          <h4>Adding events to vnode</h4>
          Although you can add a listener directly to the dom property of the vnode, it is a best practice to use the <code>v.updateProperty</code> method to let Valyrian.js handle the add and update of the element
          without worry to remove the listener if the dom updates or is removed form the dom.
          {code(`
v.directive('click', (value, vnode) => {
  vnode.props.onclick = (event, dom) => dom.innerText = \`Event $\{event.type\} fired\`;
  v.updateProperty('onclick', vnode);
});
v.mount('body', () => <button v-click>Simple button</button>);
          `)}
          <samp>{CustomDirectives.addingEventsToVnode()}</samp>
          <hr />
          <h4>Adding events to other dom and leaning events (v.onCleanup)</h4>
          If you want to add a listener to another dom element from within a directive you will need to remove the handler on each render using the <code>v.onCleanup</code> method.
          <br />
          This method runs the passed callback at the begining of each render.
          <br />
          Also you need to validate first if we are in the browser scope because in nodejs some dom methods don't exists and events can not be fired.
          {code(`
v.directive('listen-to-scroll', (value, vnode) => {
  // We check if we are not in the browser
  if (!v.isNode) {
    // Get the article element
    let article = document.getElementsByTagName('article')[0];

    // Set the listener to a var
    let listener = (e) => vnode.dom.innerText = article.scrollTop;

    // Attach the listener
    article.addEventListener('scroll', listener);

    // If we re-render the ui remove the listener before attach it again
    v.onCleanup(() => article.removeEventListener('scroll', listener));
  }
});

v.mount('body', () => <span v-listen-to-scroll></span>);
          `)}
          <samp>{CustomDirectives.addingEventsToOtherDom()}</samp>
        </Section>

        <Section title="Flag implementation example">
          We don't have flags as vue or ember but for this we can use a directive as flag.
          {code(`
let dayjs = require('dayjs');

let formatDate = (value) => dayjs(value).format('MMMM D, YYYY');

v.directive('date-inline', (date, vnode) => vnode.children = formatDate(date));
v.directive('date', (value, vnode) => vnode.children = formatDate(vnode.children[0]));

v.mount('body', () => [
  <div v-date-inline="08-16-2018"></div>,
  <div v-date>08-16-2018</div>
]);
`)}
          <samp>{CustomDirectives.flagImplementation()}</samp>
        </Section>

        <Section title="Complex example v-switch">
          This complex example shows the capabilities of Valyrian directives.
          <br />
          It works as a switch statement and needs a set of arrays as children of the form <code>{"[testCase|method, vnodes|method]"}</code>
          {code(`
v.directive('switch', (value, vnode) => {
  for (let i = 0, l = vnode.children.length; i < l; i++) {
    let [test, handler] = vnode.children[i];
    let result = typeof test === 'function' ?
      test(value) :
      value === test;

    if (result) {
      vnode.children = typeof handler === 'function' ? handler(value) : handler;
      return;
    }
  }

  vnode.children = value;
});

let Component = ({name}) => <div v-switch={name}>
  {['John', <span>Hello John</span>]}
  {[(val) => val === 'John Doe', <span>Hello John Doe</span>]}
  {['Jane', (val) => <span>Hello {val} Doe</span>]}
</div>;

v.mount('body', () => [
  <ComplexExample name='John' />,
  <ComplexExample name='John Doe' />,
  <ComplexExample name='Jane' />
]);
          `)}
          <samp>
            {<ComplexExample name="John" />}
            {<ComplexExample name="John Doe" />}
            {<ComplexExample name="Jane" />}
          </samp>
        </Section>
      </Layout>
    );
  }
};

module.exports = CustomDirectives;
