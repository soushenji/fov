'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const Validator = require('./index.js');
const validator = new Validator();


test('integer', async (t) => {
  await t.test('required default work fine with undefined', () => {
    let input = {};
    let rules = { value: { type: 'integer' } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value is required', field: 'value' });
  });

  await t.test('required true work fine with undefined', () => {
    let input = {};
    let rules = { value: { type: 'integer', required: true } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value is required', field: 'value' });
  });

  await t.test('required false work fine with undefined', () => {
    let input = {};
    let rules = { value: { type: 'integer', required: false } };
    let error = validator.validate(input, rules);
    assert.deepEqual(error, undefined);
  });

  await t.test('must be an integer', () => {
    let input = { value:'ss'};
    let rules = { value: { type: 'integer'} };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value must be an integer', field: 'value' });
  });

  await t.test('required true work fine with null', () => {
    let input = { value: null };
    let rules = { value: { type: 'integer' } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value is required', field: 'value' });
  });

  await t.test('required true work fine with null', () => {
    let input = { value: null };
    let rules = { value: { type: 'integer', required: true } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value is required', field: 'value' });
  });

  await t.test('required false work fine with null', () => {
    let input = { value: null };
    let rules = { value: { type: 'integer', required: false } };
    let error = validator.validate(input, rules);
    assert.deepEqual(error, undefined);
  });
});



test('string', async (t) => {
  await t.test('required true with undefined', () => {
    let input = {};
    let rules = { value: { type: 'string' } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error, { message: 'value is required', field: 'value' });
  });

  await t.test('required false with undefined', () => {
    let input = {};
    let rules = { value: { type: 'string', required:false } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors, undefined);
  });

  await t.test('required true with empty', () => {
    let input = {value:''};
    let rules = { value: { type: 'string' } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors[0].message, 'value is required');
  });

  await t.test('required false with empty', () => {
    let input = {value:''};
    let rules = { value: { type: 'string', required:false } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors, undefined);
  });

  await t.test('must be an integer', () => {
    let input = {value:1};
    let rules = { value: { type: 'string' } };
    let error = validator.validate(input, rules)[0];
    assert.deepEqual(error.message, 'value must be a string');
  });

  await t.test('check max', () => {
    let input = { value: 'hello' };
    let rules = { value: { type: 'string', max: 10 } };
    let errors = validator.validate(input, rules);
    assert.equal(errors, undefined);
  });

  await t.test('check max error', () => {
    let input = { value: 'hello' };
    let rules = { value: { type: 'string', max: 4 } };
    let errors = validator.validate(input, rules);
    assert.equal(errors[0].message, 'value length must be less than 4');
  });

  await t.test('check min', () => {
    let input = { value: 'hello' };
    let rules = { value: { type: 'string', min: 2 } };
    let errors = validator.validate(input, rules);
    assert.equal(errors, undefined);
  });

  await t.test('check min error', () => {
    let input = { value: 'hello' };
    let rules = { value: { type: 'string', min: 6 } };
    let errors = validator.validate(input, rules);
    assert.equal(errors[0].message, 'value length must be greater than 6');
  });
  
  await t.test('fails to match the /\\d+/ pattern', () => {
    let input = { value: 'hello' };
    let rules = { value: { type:'string', pattern:/\d+/ } };
    let errors = validator.validate(input, rules);
    assert.equal(errors[0].message, 'value fails to match the /\\d+/ pattern');
  });

  await t.test('success to match the /\\d+/ pattern', () => {
    let input = { value: '123' };
    let rules = { value: { type:'string', pattern:/\d+/ } };
    let errors = validator.validate(input, rules);
    assert.equal(errors, undefined);
  });

});




test('boolean', async (t) => {
  await t.test('required true with undefined', () => {
    let input = {};
    let rules = { value: { type: 'boolean' } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors[0], { message: 'value is required', field: 'value' });
  });

  await t.test('works with boolean', () => {
    let input = { value: true };
    let rules = { value: { type: 'boolean' } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors, undefined);
  });

  await t.test('works with integer', () => {
    let input = { value: 1 };
    let rules = { value: { type: 'boolean' } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors[0], { message: 'value must be a boolean', field: 'value' });
  });
});


test('translate zn_CN', async (t) => {
  const validator = new Validator({ language: 'zh_CN' });

  await t.test('required true with undefined', () => {
    let input = {};
    let rules = { value: { type: 'boolean' } };
    let errors = validator.validate(input, rules);
    assert.deepEqual(errors[0], { message: 'value是必须的', field: 'value' });
  });

  await t.test('fails to match the /\\d+/ pattern', () => {
    let input = { value: 'hello' };
    let rules = { value: { type:'string', pattern:/\d+/ } };
    let errors = validator.validate(input, rules);
    assert.equal(errors[0].message, 'value必须匹配/\\d+/');
  });

});


test('custom message', async (t) => {
  await t.test('custom message', () => {
    let input = {};
    let rules = { value: { type: 'boolean' } };
    let messages = { value: { required:'这里必需填写一个布尔值哦'}}
    let errors = validator.validate(input, rules, messages);
    assert.deepEqual(errors[0], { message: '这里必需填写一个布尔值哦', field: 'value' });
  });

  await t.test('works with integer', () => {
    let input = { name: 'lord of the sea', age:17 };
    let rules = {
      name: { type: 'string', min:2, max:10 },
      age: { type: 'integer', min:22, max:100, required:false }
    };
    let messages = {
      name: { type: `sailor's name should be a string`, max:`name's length must be less than :max` },
      age: { type: 'integer', min:`水手的年龄必须大于:min` }
    };

    let errors = validator.validate(input, rules, messages);
    console.log(errors);
    assert.deepEqual(errors, [
      { message: "name's length must be less than 10", field: 'name' },
      { message: "水手的年龄必须大于22", field: 'age' }
    ]);
  });
});
































