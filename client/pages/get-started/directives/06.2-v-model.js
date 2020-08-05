import Layout from '../layout';

let obj = {
  input: '',
  textarea: '',
  booleanCheckbox: true,
  otherTypeCheckbox: '',
  multipleCheckbox: [],
  radio: '',
  select: '',
  multipleSelect: []
};

let App = {
  Input() {
    return <div>
      <h3>Input</h3>
      {code(`
let obj = {
  input: ''
};
      `)}
      {code(`
<input type="text" v-model={[obj, 'input']} />
<p>Message: {obj.input}</p>
      `)}
      <samp>
        <input type="text" v-model={[obj, 'input']} placeholder="Edit me" />
        <p>Message: {obj.input}</p>
      </samp>
    </div>;
  },
  Textarea() {
    return (
      <div>
        <h3>Textarea</h3>
        {code(`
let obj = {
  textarea: ''
};
      `)}
        {code(`
<textarea v-model={[obj, 'textarea']} placeholder="Add some text"/>
<p>Multiline message: {obj.textarea}</p>
      `)}
        <samp>
          <textarea
            v-model={[obj, 'textarea']}
            placeholder="Add some text"
          />
          <p>Multiline message: {obj.textarea}</p>
        </samp>
      </div>
    );
  },
  BooleanCheckbox() {
    return (
      <div>
        <h3>Boolean checkbox</h3>
        {code(`
let obj = {
  check: true
};
      `)}
        {code(`
<input type="checkbox" id="booleanCheckbox" v-model={[obj, 'check']} />
<label for="booleanCheckbox">{obj.check}</label>
      `)}
        <samp>
          <input type="checkbox" id="booleanCheckbox" v-model={[obj, 'booleanCheckbox']} />
          <label for="booleanCheckbox">{obj.booleanCheckbox}</label>
        </samp>
      </div>
    );
  },
  OtherTypeCheckbox() {
    return (
      <div>
        <h3>Non boolean checkbox</h3>
        {code(`
let obj = {
  check: ''
};
      `)}
        {code(`
<input type="checkbox" id="otherTypeCheckbox" value="Hello world" v-model={[obj, 'check']} />
<label for="otherTypeCheckbox"> Message: {obj.check}</label>
      `)}
        <samp>
          <input type="checkbox" id="otherTypeCheckbox" value="Hello world" v-model={[obj, 'otherTypeCheckbox']} />
          <label for="otherTypeCheckbox"> Message: {obj.otherTypeCheckbox}</label>
        </samp>
      </div>
    );
  },
  MultipleCheckbox() {
    return (
      <div>
        <h3>Multiple checkboxes</h3>
        {code(`
let obj = {
  check: []
};
      `)}
        {code(`
<input type="checkbox" id="jack" value="Jack" v-model={[obj, 'check']}/>
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model={[obj, 'check']}/>
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model={[obj, 'check']}/>
<label for="mike">Mike</label>
<br />
<span>Checked names: [{obj.check.join(', ')}]</span>
      `)}
        <samp>
          <input type="checkbox" id="jack" value="Jack" v-model={[obj, 'multipleCheckbox']}/>
          <label for="jack">Jack</label>
          <input type="checkbox" id="john" value="John" v-model={[obj, 'multipleCheckbox']}/>
          <label for="john">John</label>
          <input type="checkbox" id="mike" value="Mike" v-model={[obj, 'multipleCheckbox']}/>
          <label for="mike">Mike</label>
          <br />
          <span>Checked names: [{obj.multipleCheckbox.join(', ')}]</span>
        </samp>
      </div>
    );
  },
  Radio() {
    return (
      <div>
        <h3>Radio</h3>
        {code(`
let obj = {
  radio: ''
};
      `)}
        {code(`
<input type="radio" id="hello" value="Hello" v-model={[obj, 'radio']} />
<label for="hello">Hello</label>
<input type="radio" id="world" value="World" v-model={[obj, 'radio']} />
<label for="world">World</label>
<br />
<span>Picked value: {obj.radio}</span>
      `)}
        <samp>
          <input type="radio" id="hello" value="Hello" v-model={[obj, 'radio']} />
          <label for="hello">Hello</label>
          <input type="radio" id="world" value="World" v-model={[obj, 'radio']} />
          <label for="world">World</label>
          <br />
          <span>Picked value: {obj.radio}</span>
        </samp>
      </div>
    );
  },
  Select() {
    return (
      <div>
        <h3>Select</h3>
        {code(`
let obj = {
  select: ''
};
      `)}
        {code(`
<select v-model={[obj, 'select']}>
  <option disabled value="">Select an item</option>
  <option value="D">A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: {obj.select}</span>
      `)}
        <samp>
          <select v-model={[obj, 'select']}>
            <option disabled value="">Select an item</option>
            <option value="D">A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: {obj.select}</span>
        </samp>

      </div>
    );
  },
  MultipleSelect() {
    return (
      <div>
        <h3>Multiple select</h3>
        {code(`
let obj = {
  select: []
};
      `)}
        {code(`
<select v-model={[obj, 'select']} multiple>
  <option value="D">A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Selected: [{obj.select.join(', ')}]</span>
      `)}
        <samp>
          <select v-model={[obj, 'multipleSelect']} multiple>
            <option value="D">A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: [{obj.multipleSelect.join(', ')}]</span>
        </samp>
      </div>
    );
  },
  view() {
    return (
      <div>
        <App.Input />
        <hr />
        <App.Textarea />
        <hr />
        <App.BooleanCheckbox />
        <hr />
        <App.OtherTypeCheckbox />
        <hr />
        <App.MultipleCheckbox />
        <hr />
        <App.Radio />
        <hr />
        <App.Select />
        <hr />
        <App.MultipleSelect />
      </div>
    );
  }
};

let VModel = () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>v-model directive</h1>
      </header>
      <section>
        <h2>Install</h2>
        This directive is added by a plugin, and this plugin is available with the main valyrian.js package, so, you only need to add it with the <code>v.usePlugin()</code> method.
        {code(`
import 'valyrian.js';
import VModel from 'valyrian.js/plugins/v-model.js';

v.usePlugin(VModel);
            `)}
        <hr />
        <section>
          <App/>
        </section>
      </section>
    </div>
  </Layout>
);

export default VModel;
