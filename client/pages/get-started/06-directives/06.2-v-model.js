let Section = require("../../../components/Section");
let Layout = require("../layout");

let obj = {
  input: "",
  textarea: "",
  booleanCheckbox: true,
  otherTypeCheckbox: "",
  multipleCheckbox: [],
  radio: "",
  select: "",
  multipleSelect: []
};

let App = {
  Input() {
    return (
      <Section title="Input">
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
          <input type="text" v-model={[obj, "input"]} placeholder="Edit me" />
          <p>Message: {obj.input}</p>
        </samp>
      </Section>
    );
  },
  Textarea() {
    return (
      <Section title="Textarea">
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
          <textarea v-model={[obj, "textarea"]} placeholder="Add some text" />
          <p>Multiline message: {obj.textarea}</p>
        </samp>
      </Section>
    );
  },
  BooleanCheckbox() {
    return (
      <Section title="Boolean checkbox">
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
          <input type="checkbox" id="booleanCheckbox" v-model={[obj, "booleanCheckbox"]} />
          <label for="booleanCheckbox">{obj.booleanCheckbox}</label>
        </samp>
      </Section>
    );
  },
  OtherTypeCheckbox() {
    return (
      <Section title="Non boolean checkbox">
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
          <input type="checkbox" id="otherTypeCheckbox" value="Hello world" v-model={[obj, "otherTypeCheckbox"]} />
          <label for="otherTypeCheckbox"> Message: {obj.otherTypeCheckbox}</label>
        </samp>
      </Section>
    );
  },
  MultipleCheckbox() {
    return (
      <Section title="Multiple checkboxes">
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
          <input type="checkbox" id="jack" value="Jack" v-model={[obj, "multipleCheckbox"]} />
          <label for="jack">Jack</label>
          <input type="checkbox" id="john" value="John" v-model={[obj, "multipleCheckbox"]} />
          <label for="john">John</label>
          <input type="checkbox" id="mike" value="Mike" v-model={[obj, "multipleCheckbox"]} />
          <label for="mike">Mike</label>
          <br />
          <span>Checked names: [{obj.multipleCheckbox.join(", ")}]</span>
        </samp>
      </Section>
    );
  },
  Radio() {
    return (
      <Section title="Radio">
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
          <input type="radio" id="hello" value="Hello" v-model={[obj, "radio"]} />
          <label for="hello">Hello</label>
          <input type="radio" id="world" value="World" v-model={[obj, "radio"]} />
          <label for="world">World</label>
          <br />
          <span>Picked value: {obj.radio}</span>
        </samp>
      </Section>
    );
  },
  Select() {
    return (
      <Section title="Select">
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
          <select v-model={[obj, "select"]}>
            <option disabled value="">
              Select an item
            </option>
            <option value="D">A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: {obj.select}</span>
        </samp>
      </Section>
    );
  },
  MultipleSelect() {
    return (
      <Section title="Multiple select">
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
          <select v-model={[obj, "multipleSelect"]} multiple>
            <option value="D">A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: [{obj.multipleSelect.join(", ")}]</span>
        </samp>
      </Section>
    );
  },
  view() {
    return (
      <div>
        <App.Input />
        <App.Textarea />
        <App.BooleanCheckbox />
        <App.OtherTypeCheckbox />
        <App.MultipleCheckbox />
        <App.Radio />
        <App.Select />
        <App.MultipleSelect />
      </div>
    );
  }
};

let VModel = () => (
  <Layout title="v-model directive">
    <Section title="v-model directive" />
    <Section title="Install">
      This directive is added by a plugin, and this plugin is available with the main valyrian.js package, so, you only need to add it with the <code>v.usePlugin()</code> method.
      {code(`
require('valyrian.js');
let VModel = require('valyrian.js/plugins/v-model.js');

v.usePlugin(VModel);
            `)}
    </Section>
    <App />
  </Layout>
);

module.exports = VModel;
