class Validator {
  constructor(options = { language: 'en_US', convert:true}) {
    this.translate = translate[options.language] || translate['en_US'];
    this.rules = {};
    this.field = ''; // 当前验证字段
    this.convert = options.convert ? true : false;
    this.messages = null;
    this.errors = [];
    this.checkerMap = {
      integer: 'checkInteger',
      number: 'checkNumber',
      string: 'checkString',
      boolean: 'checkBoolean'
    }
  }

  /**
   * 返回错误信息
   *
   * @param {String} messageIndex 翻译里的索引
   * @param {String} attribute 自定义规则属性，比如：require, min, max ...
   * @return {String} message 返回的消息
   */
  message(messageIndex) {
    let message = this.translate[messageIndex];
    if (message == undefined) {
      throw Error(`can not find translate attribute "${messageIndex}"`);
    }

    let attribute = messageIndex.split('.')[1];

    if (this.messages && this.messages[this.field] 
        && this.messages[this.field][attribute]
    ){
      message = this.messages[this.field][attribute];
    }
    
    message = String(message);
    message = message.replace(':field', this.field);
    message = message.replace(':min', this.rules[this.field].min);
    message = message.replace(':max', this.rules[this.field].max);
    message = message.replace(':pattern', this.rules[this.field].pattern);
    // if (['min', 'max', 'pattern'].indexOf(attribute) != -1) {
    //   message = message.replace(':'+attribute, this.rules[this.field][attribute]);
    // }
    return message;
  }

  /**
   * 验证
   * @param  {Object} input    待验证
   * @param  {Object} rules    验证规则
   * @param  {Object} messages 自定义提示信息
   * @return {Array}  错误数组
   */
  validate(input, rules, messages){
    if (typeof rules !== 'object') {
      throw new TypeError('need object type rule');
    }

    if (typeof input !== 'object' || !input) {
      throw new TypeError('the validated value should be a object');
    }

    this.rules = rules;
    this.messages = messages;
    this.errors = [];

    if(this.convert) this.convertInput(input, rules);

    for(var key in rules){
      this.field = key;
      let rule = rules[this.field];
      let checkerName = this.checkerMap[rule.type];

      if(checkerName === undefined){
        throw new TypeError(this.message('type.notSupport').replace(':type', rule.type));
      }

      let errorMessage = this[checkerName](rule, input[this.field]);
      if(typeof errorMessage === 'string'){
        this.errors.push({
          message: errorMessage,
          field: this.field
        });
      }
    }

    return this.errors.length ? this.errors : undefined;
  }


  convertInput(input, rules){
    for(var key in rules){
      let type = rules[key].type;

      if(!input.hasOwnProperty(key) || input[key] === null || input[key] === undefined){
        continue;
      }

      switch (type) {
        case 'integer':
          if(!Number.isNaN(parseInt(input[key]))) {
            input[key] = parseInt(input[key]);
          }
          break;
        case 'string':
          input[key] = String(input[key]);
          break;
        case 'number':
          if(!Number.isNaN(Number(input[key])) && input[key]!==null && input[key] !== '') {
            input[key] = Number(input[key]);
          }
          break;
        case 'boolean':
          input[key] = !!input[key];
          break;
        default:;
      }
    }
  }


  checkInteger(rule, value){
    if (value === `` || value === null || Number.isNaN(value)) {
      value = undefined;
    }

    if (typeof value === 'undefined') {
      if (rule.required === false) return;
      return this.message('integer.required');
    }

    if (typeof value !== 'number' || value % 1 !== 0) {
      return this.message('integer.type');
    }

    if (rule.hasOwnProperty('max') && value > rule.max) {
      return this.message('integer.max');
    }

    if (rule.hasOwnProperty('min') && value < rule.min) {
      return this.message('integer.min');
    }
  }


  checkNumber(rule, value){
    if (value ==='' || value === null || Number.isNaN(value)) {
      value = undefined;
    }

    if (typeof value === 'undefined') {
      if (rule.required === false) return;
      return this.message('number.required');
    }

    if (typeof value !== 'number') {
      return this.message('number.type');
    }

    if (rule.hasOwnProperty('max') && value > rule.max) {
      return this.message('number.max');
    }

    if (rule.hasOwnProperty('min') && value < rule.min) {
      return this.message('number.min');
    }
  }


  checkString(rule, value){
    if (value === null || String(value).trim() == '') {
      value = undefined;
    }

    if (typeof value === 'undefined') {
      if (rule.required === false) return;
      return this.message('integer.required');
    }

    if (typeof value !== 'string') {
      return this.message('string.type');
    }

    if (rule.hasOwnProperty('max') && value.length > rule.max) {
      return this.message('string.max');
    }

    if (rule.hasOwnProperty('min') && value.length < rule.min) {
      return this.message('string.min');
    }
      
    if (rule.pattern && !rule.pattern.test(value)) {
      return this.message('string.pattern');
    }
  }


  checkBoolean(rule, value) {
    if (typeof value === 'undefined') {
      if (rule.required === false) return;
      return this.message('integer.required');
    }

    if (typeof value !== 'boolean') {
      return this.message('boolean.type');
    }
  }


  checkEmail(rule, value) {
    if (typeof value === 'undefined') {
      if (rule.required === false) return;
      return this.message('integer.required');
    }

    if (typeof value !== 'boolean') {
      return this.message('boolean.type');
    }
  }


  checkPassword(rule, value){

  }


  checkDate(rule, value){

  }


  checkDatetime(rule, value){

  }

  


}

module.exports = Validator;


/**
 * 翻译字符串
 */
const translate = {};
translate['en_US'] = {
  'input.object':'input must be an object',
  'rules.object':'rules must be an object',
  'type.notSupport': ':type is not support',
  'integer.required': ':field is required',
  'integer.type': ':field must be an integer',
  "integer.max": `:field must be less than :max`,
  'integer.min': ':field must be greater than :min',
  'number.required': ':field is required',
  'number.type': ':field must be a number',
  'number.max': `:field must be less than :max`,
  'number.min': ':field must be greater than :min',
  'string.required': ':field is required',
  'string.type': ':field must be a string',
  'string.max': ':field length must be less than :max',
  'string.min': ':field length must be greater than :min',
  'string.pattern': ':field fails to match the :pattern pattern',
  'boolean.required': ':field is required',
  'boolean.type': ':field must be a boolean',
}
translate['zh_CN']= {
  'input.object':'验证数据必须是一个对象',
  'rules.object':'验证规则必须是一个对象',
  'type.notSupport': ':type不支持',
  'integer.required': ':field是必须的',
  'integer.type': ':field必须是整数',
  'integer.max': `:field的长度必须小于:max`,
  'integer.min': `:field的长度必须大于:min`,
  'number.required': ':field是必须的',
  'number.type': ':field必须是整数',
  'number.max': `:field的长度必须小于:max`,
  'number.min': `:field的长度必须大于:min`,
  'string.required': ':field是必须的',
  'string.type': ':field必须是字符串',
  'string.max': `:field长度必须小于:max`,
  'string.min': ':field长度必须大于:min',
  'string.pattern': ':field必须匹配:pattern',
  'boolean.required': ':field是必须的',
  'boolean.type': ':field必须是布尔值',
}

